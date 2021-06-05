import cssnano from "cssnano"
import postcss from "rollup-plugin-postcss"

export default {
  input: `source/css/style.js`,
  output: { file: `bundle/style.min.js` },
  plugins: [
    postcss({
      extract: true, // 提取
      plugins: [cssnano()], // CSS 压缩等功能
    }),
  ],
}
