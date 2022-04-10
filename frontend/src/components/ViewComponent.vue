<template>
    <div>
        <div v-if="mix_id">
            <AudioMixer
                :key="mixer_reload"
                :is_loaded="is_loaded"
                :config="config"
                ref="audiomixer"
            />
            <b-button-group>
                <b-button>Download Mix</b-button>
                <b-dropdown
                    right
                    split
                    text="Store Settings"
                    v-on:click="store_mixer_config(true, true)"
                >
                    <b-dropdown-item
                        v-on:click="store_mixer_config(true, false)"
                        >Gains only</b-dropdown-item
                    >
                    <b-dropdown-item
                        v-on:click="store_mixer_config(false, true)"
                        >Pans only</b-dropdown-item
                    >
                </b-dropdown>
                <b-dropdown
                    right
                    split
                    text="Reload Settings"
                    v-on:click="load_mixer_config()"
                >
                    <b-dropdown-item v-on:click="load_mixer_config(true, false)"
                        >Gains only</b-dropdown-item
                    >
                    <b-dropdown-item v-on:click="load_mixer_config(false, true)"
                        >Pans only</b-dropdown-item
                    >
                    <b-dropdown-divider></b-dropdown-divider>
                    <b-dropdown-item v-on:click="reset_mixer_config()"
                        >Reset</b-dropdown-item
                    >
                </b-dropdown>
            </b-button-group>
        </div>
        <b-form-checkbox v-model="online" name="online-button" switch>
            <div v-if="online">Online</div>
            <div v-else>Local</div>
        </b-form-checkbox>
        <list-component
            :mix_id="mix_id"
            v-on:load-pans="load_pans"
            v-on:load-gains="load_gains"
        />
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
            online: true,
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
            let apiURL = `${
                process.env.VUE_APP_BACKEND_URI ||
                window.location.origin.split(":").slice(0, -1).join(":") +
                    ":4000"
            }/api/by-id/${this.$route.params.id}`;
            axios.get(apiURL).then((res) => {
                this.recording = res.data;
                this.load_config();
            });
        }
    },
    watch: {
        "$route.params.id": function () {
            this.mix_id = this.$route.params.id;

            let apiURL = `${
                process.env.VUE_APP_BACKEND_URI ||
                window.location.origin.split(":").slice(0, -1).join(":") +
                    ":4000"
            }/api/by-id/${this.$route.params.id}`;
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
            for (const channel of this.recording.channels) {
                let url;
                if (this.online) {
                    url = channel.url;
                } else {
                    url = `${
                        process.env.VUE_APP_BACKEND_URI ||
                        window.location.origin
                            .split(":")
                            .slice(0, -1)
                            .join(":") + ":4000"
                    }/audio-files/${channel.file}`;
                }
                this.config.tracks.push({
                    title: channel.title,
                    url: url,
                    pan: channel.pan ?? 0,
                    gain: channel.gain ?? 0.5,
                    muted: false,
                    hidden: false,
                });
            }
        },
        store_mixer_config: async function (bGains = true, bPans = true) {
            let updates = [];
            for (const track of this.config.tracks) {
                let update = { title: track.title };
                if (bGains) {
                    update.gain = track.gain;
                }
                if (bPans) {
                    update.pan = track.pan;
                }
                updates.push(update);
            }
            let apiURL = `${
                process.env.VUE_APP_BACKEND_URI ||
                window.location.origin.split(":").slice(0, -1).join(":") +
                    ":4000"
            }/api/update-recording/${this.mix_id}`;
            await axios.post(apiURL, updates).catch((error) => {
                console.log(error);
            });
        },
        reset_mixer_config: async function () {
            for (const track of this.config.tracks) {
                track.gain = 0.5;
                track.pan = 0;
            }
        },
        load_pans: function (id) {
            console.log("load_pans", id)
            this.load_mixer_config(false, true, id);
        },
        load_gains: function (id) {
            console.log("load_gains", id)
            this.load_mixer_config(true, false, id);
        },
        load_mixer_config: async function (
            bGains = true,
            bPans = true,
            id = this.mix_id
        ) {
            console.log("load_mixer_config", bGains, bPans, id);
            let apiURL = `${
                process.env.VUE_APP_BACKEND_URI ||
                window.location.origin.split(":").slice(0, -1).join(":") +
                    ":4000"
            }/api/by-id/${id}`;
            axios.get(apiURL).then((res) => {
                console.log(res.data.channels);
                this.newconfig = this.config;
                for (const channel of res.data.channels) {
                    for (let i = 0; i < this.newconfig.tracks.length; i++) {
                        if (this.newconfig.tracks[i].title == channel.title) {
                            if (bGains && channel.gain!=null) {
                                console.log("gain")
                                this.newconfig.tracks[i].gain = channel.gain;
                            }
                            if (bPans && channel.pan!=null) {
                                this.newconfig.tracks[i].pan = channel.pan;
                            }
                        }
                    }
                    //new_tracks.forEach(function (track, index, new_tracks) {
                        
                    //});
                }
                this.config = this.newconfig;
                console.log(this.config.tracks[3].gain);
                console.log(this.config.tracks[4].pan);
            });
        },
    },
};
</script>
