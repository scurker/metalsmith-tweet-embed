import fs from 'fs';
import path from 'path';
import embed from '../src/index';
import { promisify } from 'util';
import test from 'ava';
import rimraf from 'rimraf';
import _metalsmith from 'metalsmith';

const metalsmith = p => {
  let m = _metalsmith(path.resolve(__dirname, `./fixtures/${p}`)).destination('build').source('.');
  return new Proxy(m, {
    get(target, name) {
      if(name === 'build') {
        return promisify(m.build);
      } else {
        return target[name];
      }
    }
  });
};

const readfile = p => promisify(fs.readFile)(path.resolve(__dirname, `./fixtures/${p}`), 'utf8');

test.afterEach.always(async () => {
  let rimrafAsync = promisify(rimraf);
  await rimrafAsync(path.resolve(__dirname, './fixtures/*/build'));
});

test('should embed tweet in place of status', async t => {
  await metalsmith('embed')
    .use(embed())
    .build();

  let contents = await readfile('embed/build/index.html');

  t.regex(contents, /Hello World/);
  t.regex(contents, /@BillGates/);
});

test('should embed multiple tweets in place of statuses', async t => {
  await metalsmith('multi-embed')
    .use(embed())
    .build();

  let contents = await readfile('multi-embed/build/index.html');

  t.regex(contents, /Hello World/);
  t.regex(contents, /@BillGates/);
  t.regex(contents, /Greetings From Apollo 8/);
  t.regex(contents, /@NASA/);
});

test('should pass-through options to twitter oembed api', async t => {
  await metalsmith('embed')
    .use(embed({ options: { omit_script: false } }))
    .build();

  let contents = await readfile('embed/build/index.html');

  t.notRegex(contents, /widget\.js/);
});

test.failing('should allow frontmatter options to override pipeline options', async t => {
  await metalsmith('frontmatter')
    .use(embed({ options: { align: 'left' } }))
    .build();

  let contents = await readfile('frontmatter/build/index.html');

  t.regex(contents, /align="right"/);
});

test('should only match files with pattern', async t => {
  await metalsmith('match-files')
    .use(embed({ pattern: '**/*.md' }))
    .build();

  let html = await readfile('match-files/build/file1.html')
    , markdown = await readfile('match-files/build/file2.md');

  t.notRegex(html, /Hello World/);
  t.regex(markdown, /Hello World/);

});