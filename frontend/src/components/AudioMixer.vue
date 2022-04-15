
<template>
    <div>
        <div style="text-align: center">
            <div style="position: relative; display: flex">
                <vue-audio-mixer
                    :config="config"
                    size="medium"
                    theme="dark"
                    @loaded="loadedChange"
                    :showPan="true"
                    :showTotalTime="true"
                    :showRecord="false"
                />
            </div>
        </div>
    </div>
</template>
<script>
import VueAudioMixer from "vue-audio-mixer";
import "vue-audio-mixer/dist/vue-audio-mixer.min.css";

export default {
    methods: {
        update() {
            this.$forceUpdate();
        },
        loadedChange(loaded) {
            this.$emit("loaded",loaded)
        },
    },
    components: {
        VueAudioMixer,
    },
    props: ["config"],
};
</script>