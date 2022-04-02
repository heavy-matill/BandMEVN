
<template>
    <div>
        <div style="text-align: center">
            <div style="position: relative; display: inline-block">
                <VueAudioMixer
                    :config="config"
                    size="medium"
                    theme="dark"
                    :showPan="true"
                    :showTotalTime="true"
                />
            </div>
        </div>
    </div>
</template>
  <script src="https://unpkg.com/vue@2.6.14/dist/vue.js"></script>
  <script src="https://unpkg.com/vue-audio-mixer/dist/vue-audio-mixer.min.js"></script>
<script>
import VueAudioMixer from "vue-audio-mixer";

export default {
    methods: {
        update() {
            this.$forceUpdate();
        },
    },
    components: {
        VueAudioMixer,
    },
    props: ["is_loaded", "newconfig", "config"],
};
</script>