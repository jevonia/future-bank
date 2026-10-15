// Type support for importing images (e.g. `import photo from "./photo.jpg"`).
// Next normally adds this through the generated, untracked next-env.d.ts,
// which doesn't exist yet when CI typechecks before building.
/// <reference types="next/image-types/global" />
