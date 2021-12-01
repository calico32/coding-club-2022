import axios from 'axios'
import cheerio from 'cheerio'
import { existsSync } from 'node:fs'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const resolvePath = (p: string) => path.resolve(__dirname, '..', p)

const libUrl = (id: number) => `https://madtakes.com/libs/${id.toString().padStart(3, '0')}.html`
const word = (id: number) => `<span class="mG_glibword" id="mG_w${id}">WORD</span>`

const header = `\
//
// Generated file. Do not edit.
//

// ignore_for_file: lines_longer_than_80_chars`

const CACHE_DATE = resolvePath('cache/.date')

const fetchAll = async () => {
  let cacheDate = 0
  if (existsSync(CACHE_DATE)) cacheDate = parseInt(await readFile(CACHE_DATE, 'utf-8'))

  if (cacheDate > Date.now() - 1000 * 60 * 60 * 24 * 7) {
    console.log('using cache')
    return
  }

  console.log('fetching all')

  let id = 1
  while (true) {
    const url = libUrl(id)
    const response = await axios.get(url, { validateStatus: () => true })
    if (response.status === 404) {
      break
    }

    await writeFile(resolvePath(`cache/${id}.html`), response.data)
    id++
  }

  await writeFile(CACHE_DATE, Date.now().toString())

  console.log(`fetched ${id} files`)
}

const indexDartImports: string[] = []
const indexDartStories: string[] = []

try {
  await fetchAll()

  const listing = (await readdir(resolvePath('cache'))).filter((f) => f.endsWith('.html'))

  listing.sort((a, b) => parseInt(a.replace('.html', '')) - parseInt(b.replace('.html', '')))

  for (const file of listing) {
    const id = parseInt(file.replace('.html', ''))
    const html = await readFile(resolvePath(`cache/${id}.html`), 'utf-8')

    const $ = cheerio.load(html)
    const title = $('.mG_page_title')
      .text()
      .replaceAll('"', '\\"')
      .replaceAll('\n', '\\n')
      .replaceAll('`', "'")
      .replace('ad-Lib', '')
      .trim()
    const fields = $('td[align="right"]')
      .map((i, el) => ({
        id: parseInt($(el).next().children().attr('id')!.replace('w', '')),
        label: $(el).text().replaceAll('"', '\\"').replaceAll('\n', '\\n'),
      }))
      .get()
    let story = $('.mG_glibbox')
      .html()!
      .replace(/<br>/g, '\\n')
      .replace(/`/g, "'")
      .replace(/<input.+?>/g, '')
      .replace(/<\/?(i|b|em)\>/g, '')
      .replace(/\s+/g, ' ')
      .trim()

    if (story.includes('<tr') || story.includes('<td') || story.includes('<li')) {
      console.log(`skipping ${id}`)
      continue
    }

    const hiddenFields = $('input[type="hidden"][value^="{!"]')
      .map((i, el) => ({
        id: parseInt(el.attribs.id.replace('w', '')),
        target: parseInt(el.attribs.value.replace(/[{!}]/g, '')),
      }))
      .get()

    fields.forEach(({ id, label: originalLabel }) => {
      let wordType = 'other'

      const label = originalLabel.toLowerCase().trim()
      if (label.includes('noun')) {
        if (label.includes('plural')) {
          originalLabel = ''
          wordType = 'pluralNoun'
        } else if (label == 'noun') {
          originalLabel = ''
          wordType = 'noun'
        }
      } else if (label.includes('verb')) {
        if (label.includes('"ing"')) {
          originalLabel = ''
          wordType = 'verbIng'
        } else if (label.includes('"ed"')) {
          originalLabel = ''
          wordType = 'verbPast'
        } else if (label == 'verb') {
          originalLabel = ''
          wordType = 'verb'
        }
      } else if (label.includes('adjective')) {
        wordType = 'adjective'
        originalLabel = ''
      } else if (label.includes('adverb')) {
        wordType = 'adverb'
        originalLabel = ''
      } else if (label.includes('superlative')) {
        wordType = 'superlative'
        originalLabel = ''
      } else if (label.includes('name')) {
        wordType = 'name'
        if (label == 'name') {
          originalLabel = ''
        }
      } else if (label.includes('number')) {
        wordType = 'number'
        originalLabel = ''
      } else if (label.includes('preposition')) {
        wordType = 'preposition'
        originalLabel = ''
      } else {
        if (label.includes('time span')) {
          originalLabel = 'Timespan'
        }
      }

      originalLabel = originalLabel
        .toLowerCase()
        .replace(/Plural$/, '(plural)')
        .replaceAll(' Of ', ' of ')
        .replaceAll(' And ', ' and ')
        .replaceAll(' A ', ' a ')
        .replaceAll(' An ', ' an ')
        .replaceAll(' The ', ' the ')
        .replace(/(\w)\(/g, '$1 (')

      let line
      if (originalLabel) {
        line = `\nW WordType.${wordType}, "${originalLabel}"\nT `
      } else {
        line = `\nW WordType.${wordType}\nT `
      }

      // console.log(story)
      // console.log('-------------------------------------')

      story = story.replace(word(id), line)
    })

    hiddenFields.forEach(({ id, target }) => {
      story = story.replace(word(id), `"\nC ${target - id}\nT "`)
    })

    story = 'T ' + story.replace(/(\\n|\s)+$/g, '')

    const lines = story.split('\n')

    const codeLines = lines
      .flatMap((line) => {
        if (line.startsWith('T ')) {
          return `  ..text("${line
            .replace('T ', '')
            .replaceAll('"', '\\"')
            .replaceAll('$', '\\$')}")`
        } else if (line.startsWith('C ')) {
          return `  ..copy(${line.replace('C ', '')})`
        } else if (line.startsWith('W ')) {
          return `  ..word(${line.replace('W ', '')})`
        } else {
          return []
        }
      })
      .join('\n')

    const code = `\
${header}

import '../story.dart';
import '../text.dart';

StoryBuilder story${id - 1} = StoryBuilder()
  ..title("${title}")
${codeLines};
`

    await writeFile(resolvePath(`../lib/generated/story${id - 1}.dart`), code)

    indexDartImports.push(`import 'story${id - 1}.dart';`)
    indexDartStories.push(`  story${id - 1},`)

    console.log(`${id} done`)
  }
} catch (e) {
  console.error((e as any).stack)
  process.exit(1)
}

const indexDart = `\
${header}

import '../extensions/map_with_index.dart';
import '../story.dart';
${indexDartImports.join('\n')}

List<StoryBuilder> _builders = [
${indexDartStories.join('\n')}
];

List<Story> stories = _builders.mapIndex(
  (builder, id) => builder.id(id).pack(),
);
`

await writeFile(resolvePath('../lib/generated/stories.dart'), indexDart)
