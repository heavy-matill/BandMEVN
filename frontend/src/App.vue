<template>
    <div>
        <b-navbar
            toggleable="lg"
            type="light"
            variant="info"
            class="
                navbar navbar-dark
                bg-primary
                justify-content-between
                flex-nowrap flex-row
            "
        >
            <b-navbar-brand href="#">Band MEVN</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <b-nav-item
                        ><router-link class="nav-link" to="/view"
                            >View Recordings</router-link
                        ></b-nav-item
                    >
                    <b-nav-item
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
