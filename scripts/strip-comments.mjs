#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import fg from 'fast-glob'
import { parse } from '@babel/parser'
import generate from '@babel/generator'

const args = process.argv.slice(2)
const getArg = (name, def = undefined) => {
  const i = args.indexOf(`--${name}`)
  if (i !== -1) return args[i + 1] ?? true
  return def
}

const targetPath = getArg('path', 'src')
const dryRun = Boolean(getArg('dry-run', false))
const apply = Boolean(getArg('apply', false))

if (!dryRun && !apply) {
  console.log('Usage: node scripts/strip-comments.mjs --path src --dry-run | --apply')
  process.exit(1)
}

const exts = ['js', 'jsx', 'ts', 'tsx']

function toTitleCaseFromFilename(fp) {
  const name = path.basename(fp).replace(path.extname(fp), '')
  const spaced = name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .trim()
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

function inferMarker(file) {
  const rel = file.replace(/\\/g, '/').toLowerCase()
  if (rel.includes('/app/api/')) return '// API'
  if (rel.includes('/components/')) return `// ${toTitleCaseFromFilename(file)} Component`
  if (rel.includes('/app/')) return `// ${toTitleCaseFromFilename(file)} Page`
  if (rel.includes('/lib/')) return `// Library`
  return `// ${toTitleCaseFromFilename(file)}`
}

function stripComments(code, file) {
  const isTS = file.endsWith('.ts') || file.endsWith('.tsx')
  const isJSX = file.endsWith('.jsx') || file.endsWith('.tsx')
  const ast = parse(code, {
    sourceType: 'module',
    plugins: [
      isTS ? 'typescript' : null,
      isJSX ? 'jsx' : null,
      'classProperties',
      'classPrivateProperties',
      'classPrivateMethods',
      'decorators-legacy',
      'dynamicImport',
      'importMeta',
      'topLevelAwait'
    ].filter(Boolean)
  })
  const output = generate.default(ast, { comments: false, compact: false }, code)
  const marker = inferMarker(file)
  const withMarker = `${marker}\n${output.code}`
  return withMarker
}

async function run() {
  const patterns = exts.map((e) => `${targetPath}/**/*.${e}`)
  const files = await fg(patterns, { dot: false })
  if (files.length === 0) {
    console.log('No files found in', targetPath)
    return
  }
  let changed = 0
  for (const file of files) {
    const orig = fs.readFileSync(file, 'utf8')
    const cleaned = stripComments(orig, file)
    if (orig !== cleaned) {
      changed++
      if (dryRun) {
        console.log(`[DRY-RUN] Would update: ${file}`)
      } else if (apply) {
        fs.writeFileSync(file, cleaned, 'utf8')
        console.log(`[UPDATED] ${file}`)
      }
    }
  }
  console.log(`${dryRun ? 'Would update' : 'Updated'} ${changed} file(s).`)
}

run().catch((e) => {
  console.error('Error:', e)
  process.exit(1)
})
