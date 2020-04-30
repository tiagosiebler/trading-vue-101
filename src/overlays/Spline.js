
// Adds all necessary stuff for you.
import { Overlay } from 'trading-vue-js'

// Modified to support colours in a series (stored in settings as array)
export default {
    name: 'Spline',
    mixins: [Overlay],
    methods: {
        meta_info() {
            return { author: 'C451', version: '1.0.1', contributors: ['Tiago Siebler'] }
        },
        // Here goes your code. You are provided with:
        // { All stuff is reactive }
        // $props.layout -> positions of all chart elements +
        //  some helper functions (see layout_fn.js)
        // $props.interval -> candlestick time interval
        // $props.sub -> current subset of candlestick data
        // $props.data -> your indicator's data subset.
        //  Comes "as is", should have the following format:
        //  [[<timestamp>, ... ], ... ]
        // $props.colors -> colors (see TradingVue.vue)
        // $props.cursor -> current position of crosshair
        // $props.settings -> indicator's custom settings
        //  E.g. colors, line thickness, etc. You define it.
        // $props.num -> indicator's layer number (of All
        // layers in the current grid)
        // $props.id -> indicator's id (e.g. EMA_0)
        // ~
        draw(ctx) {
            ctx.lineWidth = this.line_width
            ctx.beginPath()

            const layout = this.$props.layout
            const i = this.data_index
            const nextEl = i + 1;

            const settings = this.$props;
            const colorData = this.$props.settings.colors;

            let lx = 0;
            let ly = 0;
            for (let rowIndex = 0;rowIndex < this.$props.data.length;rowIndex++) {
                const row = this.$props.data[rowIndex];
                let x = layout.t2screen(row[0]);
                let y = layout.$2screen(row[i]);

                // provide a colour value either as 3rd column in row or indicator.settings.colors[i]
                const color = row.length >= nextEl ? (colorData && colorData.length && colorData[rowIndex]) || row[i + 1] : this.color;

                if (rowIndex == 0) {
                    ctx.lineTo(x, y);
                } else {
                    ctx.beginPath();
                    ctx.moveTo(lx, ly);
                    ctx.quadraticCurveTo(lx, ly, x, y);
                }

                lx = x;
                ly = y;
                ctx.strokeStyle = color;
                ctx.stroke();
                ctx.closePath();
            }
        },

        // For all data with these types overlay will be
        // added to the renderer list. And '$props.data'
        // will have the corresponding values. If you want to
        // redefine the default behviour for a prticular
        // indicator (let's say EMA),
        // just create a new overlay with the same type:
        // e.g. use_for() { return ['EMA'] }.
        use_for() { return ['Spline', 'EMA', 'SMA'] },

        // Colors for the legend, should have the
        // same dimention as a data point (excl. timestamp)
        data_colors() {
            const res = [this.color];
            // console.log('data_colors()res: ', res);
            return res;
        }
    },
    // Define internal setting & constants here
    computed: {
        sett() {
            return this.$props.settings;
        },
        line_width() {
            return this.sett.lineWidth || 0.75;
        },
        color() {
            const n = this.$props.num % 5;
            const res = this.sett.color || this.COLORS[n];
            console.log('color()res: ', res);
            return res;
        },
        data_index() {
            return this.sett.dataIndex || 1;
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