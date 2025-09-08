<template>
  <div style="position: relative">
    <canvas ref="chartCanvas" :height="height"></canvas>
  </div>
</template>

<script>
import {
  ArcElement,
  Chart as ChartJS,
  DoughnutController,
  Legend,
  PieController,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement, DoughnutController, PieController);

export default {
  name: "PieChart",
  props: {
    data: {
      type: Object,
      default: () => ({ labels: [], datasets: [] }),
    },
    options: {
      type: Object,
      default: () => ({
        responsive: true,
        maintainAspectRatio: false,
      }),
    },
    height: {
      type: [Number, String],
      default: 180,
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.createChart();
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.updateChart();
      },
    },
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  },
  methods: {
    createChart() {
      if (this.chart) {
        this.chart.destroy();
      }

      const ctx = this.$refs.chartCanvas.getContext("2d");
      this.chart = new ChartJS(ctx, {
        type: "pie",
        data: this.data,
        options: this.options,
      });
    },
    updateChart() {
      if (this.chart) {
        this.chart.data = this.data;
        this.chart.update();
      } else {
        this.createChart();
      }
    },
  },
};
</script>
