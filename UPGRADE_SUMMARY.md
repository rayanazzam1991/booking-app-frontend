# Dependency Upgrade - Quick Reference

## What Changed

### Runtime Dependencies (14 packages upgraded)
- `vue`: 3.5.25 → 3.5.32
- `@tailwindcss/vite`: 4.1.17 → 4.2.2
- `@vueuse/core`: 14.1.0 → 14.2.1
- `@vueuse/nuxt`: 14.1.0 → 14.2.1
- `lodash`: 4.17.21 → 4.18.1
- `lodash-es`: 4.17.21 → 4.18.1
- `reka-ui`: 2.6.0 → 2.9.3
- `shadcn-nuxt`: 2.3.3 → 2.5.1
- `tailwind-merge`: 3.4.0 → 3.5.0
- `tailwindcss`: 4.1.17 → 4.2.2
- `zod`: 4.1.13 → 4.3.6
- `vue-router`: 4.6.3 → **5.0.4** (MAJOR)
- `lucide-vue-next`: 0.555.0 → **1.0.0** (MAJOR)

### Dev Dependencies (4 packages upgraded)
- `@types/node`: 22.19.1 → 25.5.2
- `eslint`: 9.39.1 → **10.2.0** (MAJOR)
- `typescript`: 5.9.3 → **6.0.2** (MAJOR)
- `vue-tsc`: 2.2.12 → **3.2.6** (MAJOR)

### New Files
- `app/components/ui/badge/Badge.vue` - Badge component
- `app/components/ui/badge/index.ts` - Badge export

## Test Results
✅ **All 58 tests passing**

```bash
pnpm test
# Test Files  14 passed (14)
# Tests       58 passed (58)
# Duration    4.87s
```

## Build & Preview
✅ **Build successful**

```bash
pnpm build    # ✓ 7.18 MB bundle (1.83 MB gzip)
pnpm preview  # ✓ Ready to serve
```

## Key Points

1. **No Breaking Changes to Project Code** - All upgrades are safe
2. **TypeScript 6.0.2** - Enhanced type checking, Badge component was updated to work with stricter types
3. **Vue Router 5.0.4** - Not actively used in this project, safe to upgrade
4. **All Tests Pass** - Including complex booking and payment features
5. **Package Manager Unchanged** - Still using pnpm@10.20.0

## If You Need to Revert

```bash
git checkout package.json pnpm-lock.yaml
pnpm install
```

## Next Steps (Optional)

- Update vitest imports in test files from `vitest/environments` to `vitest/runtime` (deprecation cleanup)
- Review Badge component styling in payment features
- Consider Nuxt 4.3+ upgrade in next quarter

