<template>
    <div>
        <b-navbar
            toggleable="lg"
            type="dark" variant="dark"
            class="
                navbar navbar-dark
                navbar-custom
            "
        >
            <b-navbar-brand href="#">Semfshow</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <b-nav-item
                        ><router-link class="nav-link" to="/view"
                            >View Recordings</router-link
                        ></b-nav-item
                    >
                    <b-nav-item v-if="false"
                        ><router-link class="nav-link" to="/parse"
                            >Parser</router-link
                        ></b-nav-item
                    >
                    <b-nav-item> </b-nav-item>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
        <!-- Router view -->
        <div class="container mt-5">
            <router-view></router-view>
        </div>
    </div>
</template>
<style>
.navbar .navbar-brand {
    margin-left: 15px;
}
</style>
