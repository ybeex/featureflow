declare module 'virtual:ff-manifest' {
  const manifest: Record<string, { packages: string[]; ff: string[]; files: string[] }>;
  export default manifest;
}
declare module '*?js' {
  const source: string;
  export default source;
}
declare module '*?raw' {
  const source: string;
  export default source;
}
