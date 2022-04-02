<template>
    <div>
        <AudioMixer
            v-if="mix_id"
            :key="mixer_reload"
            :is_loaded="is_loaded"
            :config="config"
            ref="audiomixer"
        />
        <list-component :mix_id="mix_id" />
    </div>
</template>

<script>
import axios from "axios";
import ListComponent from "./ListComponent.vue";
import AudioMixer from "./AudioMixer.vue";

export default {
    data() {
        return {
            recording: {},
            mix_id: "",
            mixer_reload: 0,
            is_loaded: false,
            newconfig: {},
            config: {
                tracks: [],
                master: {
                    pan: 0,
                    gain: 1,
                    muted: false,
                },
            },
        };
    },
    components: { AudioMixer, ListComponent },
    created() {
        this.mix_id = this.$route.params.id;
        if (this.mix_id) {
            let apiURL = `http://localhost:4000/api/by-id/${this.$route.params.id}`;
            axios.get(apiURL).then((res) => {
                this.recording = res.data;
                this.load_config();
            });
        }
    },
    watch: {
        "$route.params.id": function () {
            this.mix_id = this.$route.params.id;
            let apiURL = `http://localhost:4000/api/by-id/${this.$route.params.id}`;
            axios.get(apiURL).then((res) => {
                this.recording = res.data;
                this.load_config();
            });
        },
    },
    methods: {
        load_config() {
            let audiomixer = this.$refs.audiomixer.$children[0];
            if (audiomixer.playing) audiomixer.stop();
            this.is_loaded = false;
            this.mixer_reload++;
            this.config.tracks = [];
            for (const [instrument, value] of Object.entries(
                this.recording.channels
            )) {
                this.config.tracks.push({
                    title: instrument,
                    url: value.url,
                    pan: 0,
                    gain: 0.5,
                    muted: false,
                    hidden: false,
                });
            }
        },
    },
};
</script>
