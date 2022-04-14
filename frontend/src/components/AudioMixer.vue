
<template>
    <div>
        <div style="text-align: center">
            <div style="position: relative; display: inline-block">
                <vue-audio-mixer
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
<script>
import VueAudioMixer from "vue-audio-mixer";
import 'vue-audio-mixer/dist/vue-audio-mixer.min.css'; 

export default {
    methods: {
        update() {
            this.$forceUpdate();
        },
    },
    components: {
        VueAudioMixer,
    },
    props: ["is_loaded", "config"],
};
</script>