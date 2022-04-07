<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <h3 class="text-center">Update Recording</h3>
      <form @submit.prevent="handleUpdateForm">
        <div class="form-group">
          <label>Name</label>
          <input
            type="text"
            class="form-control"
            v-model="recording.name"
            required
          />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input
            type="email"
            class="form-control"
            v-model="recording.email"
            required
          />
        </div>

        <div class="form-group">
          <label>Phone</label>
          <input
            type="text"
            class="form-control"
            v-model="recording.phone"
            required
          />
        </div>

        <div class="form-group">
          <button class="btn btn-danger btn-block">Update</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      recording: {},
    };
  },
  created() {
    let apiURL = `http://localhost:4000/api/edit-recording/${this.$route.params.id}`;

    axios.get(apiURL).then((res) => {
      this.recording = res.data;
    });
  },
  methods: {
    handleUpdateForm() {
      let apiURL = `http://localhost:4000/api/update-recording/${this.$route.params.id}`;

      axios
        .put(apiURL, this.recording)
        .then((res) => {
          console.log(res);
          this.$router.push("/view");
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
n