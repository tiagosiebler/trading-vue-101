<template>
<!-- TradingVueJs 101 (example from 'Getting Started' ) -->

<trading-vue
    :data="chart"
    :width="this.width"
    :height="this.height"
    :color-back="colors.colorBack"
    :color-grid="colors.colorGrid"
    :color-text="colors.colorText"
    :overlays="overlays">
</trading-vue>
</template>

<script>
import TradingVue from 'trading-vue-js'
import Data from '../data/dataCustom.json'
import Grin from './Grin.js' // New import
import Spline from './overlays/Spline'
import Splines from './overlays/Splines'

export default {
    name: 'app',
    components: { TradingVue },
    methods: {
        onResize(event) {
            this.width = window.innerWidth
            this.height = window.innerHeight
        }
    },
    mounted() {
        window.addEventListener('resize', this.onResize)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
    },
    data() {
        return {
            chart: Data,
            width: window.innerWidth,
            height: window.innerHeight,
            colors: {
                colorBack: '#000',
                colorGrid: '#262626',
                colorText: '#fff',
            },
            overlays: [Spline, Splines]
        }
    }
}
</script>
