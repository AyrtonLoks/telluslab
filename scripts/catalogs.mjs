import { mathematicsSeed } from '../packages/curriculum-mathematics/seed.mjs';
import { programmingSeed } from '../packages/curriculum-programming/seed.mjs';
import { economicsSeed } from '../domains/economics-finance/seed.mjs';
import { physicsSeed } from '../domains/physics/seed.mjs';
import { engineeringSeed } from '../domains/engineering/seed.mjs';
import { humanitiesSeed } from '../domains/humanities/seed.mjs';
import { languageSeed } from '../domains/languages/seed.mjs';
import { literatureSeed } from '../domains/literature/seed.mjs';
import { MATH_DOMAIN } from '../packages/learning-core/domain-packs.mjs';

export function loadCatalogs() {
  const math = mathematicsSeed();
  const programming = programmingSeed(math);
  const physics = physicsSeed(math, programming);
  const economics = economicsSeed(math, programming);
  const engineering = engineeringSeed(math, physics, programming);
  const humanities = humanitiesSeed(math, economics, programming, physics);
  const dependencies = [math, programming, economics, physics, engineering, humanities]
    .map(catalog => ({id:catalog.domainId ?? MATH_DOMAIN, catalog}));
  const languages = languageSeed(dependencies);
  const literature = literatureSeed([...dependencies, {id:languages.domainId, catalog:languages}]);
  return [math, programming, economics, physics, engineering, humanities, languages, literature];
}
