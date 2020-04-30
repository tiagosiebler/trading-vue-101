// Channel renderer. (Keltner, Bollinger)
import { Overlay } from 'trading-vue-js'

// Modified to support colours in a series (stored in settings as array)
export default {
    name: 'Splines',
    mixins: [Overlay],
    methods: {
        meta_info() {
            return { author: 'C451', version: '1.0.1', contributors: ['Tiago Siebler'] }
        },
        draw(ctx) {
            const layout = this.$props.layout
            const settings = this.$props.settings
            const sampleRow = this.$props.data.length && this.$props.data[0]
            const totalLines = sampleRow ? sampleRow.length - 1 : 0

            for (var i = 0; i < totalLines; i++) {
                const lineSettings = settings[i] || settings[i.toString()] || {}
                const colorSettings = lineSettings.colors

                let lx = 0
                let ly = 0
                for (let rowIndex = 0;rowIndex < this.$props.data.length;rowIndex++) {
                    const p = this.$props.data[rowIndex]
                    const x = layout.t2screen(p[0])
                    const y = layout.$2screen(p[i+1])

                    if (rowIndex == 0) {
                        ctx.beginPath()
                        ctx.lineTo(x, y)
                    } else {
                        ctx.beginPath()
                        ctx.moveTo(lx, ly)
                        ctx.quadraticCurveTo(lx, ly, x, y)
                    }

                    lx = x
                    ly = y

                    ctx.lineWidth = this.widths[i] || this.line_width
                    ctx.strokeStyle = colorSettings && colorSettings[rowIndex] || this.clrx[i]

                    ctx.stroke()
                    ctx.closePath()
                }
            }
        },
        use_for() { return ['Splines', 'DMI'] },
        data_colors() { return this.clrx }
    },
    // Define internal setting & constants here
    computed: {
        sett() {
            return this.$props.settings
        },
        line_width() {
            return this.sett.lineWidth || 0.75
        },
        widths() {
            return this.sett.lineWidths || []
        },
        clrx() {
            let colors = this.sett.colors || []
            let n = this.$props.num
            if (!colors.length) {
                for (var i = 0; i < this.lines_num; i++) {
                    colors.push(this.COLORS[(n + i) % 5])
                }
            }
            return colors
        },
        lines_num() {
            if (!this.$props.data[0]) return 0
            return this.$props.data[0].length - 1
        }
    },
    data() {
        return {
            COLORS:
            [
                '#42b28a', '#5691ce', '#612ff9',
                '#d50b90', '#ff2316'
            ]
        }
    }
}
