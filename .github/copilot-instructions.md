# Copilot Instructions for ioBroker.public-transport

## Translation/i18n Guidelines

When adding new translation keys to the project:

- **Only add translations to German (DE) and English (EN) language files**
- Other language files (ES, FR, IT, NL, PL, PT, RU, UK, ZH-CN) are managed through automated translation processes
- Translation files are located in:
  - `admin/custom/i18n/de.json` and `admin/custom/i18n/en.json`
  - `admin/i18n/de/translations.json` and `admin/i18n/en/translations.json`
  - `src-admin/src/i18n/de.json` and `src-admin/src/i18n/en.json`

After adding translations to DE and EN files, run:
```bash
npm run translate
```

This command will automatically propagate translations to all other supported languages.

## Log Message Guidelines

- **All log messages must use translation tokens** - never use hardcoded strings
- Token naming convention: `msg_<filename><description>`
  - Example: For file `departure.ts` use tokens like `msg_departureQueryError`, `msg_departureWriteError`
- Use `this.library.translate('token_name', param1, param2, ...)` for all log messages
- Parameters in translation strings use `%s` placeholders
