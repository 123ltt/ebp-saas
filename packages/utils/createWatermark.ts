
/**
 * 生成水印背景图片
 * @param text 水印文字
 */
export default function createWatermark (text: string) {
  const FONTFAMILY = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"
  const WIDTH = 500
  const HEIGHT = 200
  const SIZE = 14

  const canvas = window.document.createElement('canvas')
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  canvas.width = WIDTH
  canvas.height = HEIGHT
  ctx.fillStyle = 'rgba(136,136,136,0.15)'

  // 旋转
  const circleX = WIDTH / 2
  const circleY = HEIGHT / 2
  ctx.translate(circleX, circleY)
  ctx.rotate((-25 * Math.PI) / 180)
  ctx.font = `${SIZE}px ${FONTFAMILY}`
  ctx.textAlign = 'center'
  ctx.fillText(text, -50, -50)
  ctx.fillText(text, -150, -150)
  ctx.fillText(text, 56, 62)
  ctx.fillText(text, 140, 150)
  ctx.translate(-circleX, -circleY)

  return canvas.toDataURL('image/png')
}
