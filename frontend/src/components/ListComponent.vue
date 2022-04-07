<template>
    <div>
        <v-table
            :data="Recordings"
            :filters="filters"
            :currentPage.sync="currentPage"
            :pageSize="10"
            @totalPagesChanged="totalPages = $event"
            class="table"
        >
            <thead slot="head">
                <th>
                    <div
                        v-if="
                            Object.entries(filters).some(
                                (filt) => filt[1].value
                            )
                        "
                        v-on:click="
                            Object.entries(filters).forEach((filt) => {
                                filt[1].value = '';
                            })
                        "
                    >
                        <font-awesome-icon
                            icon="fa-solid fa-filter-circle-xmark"
                        />
                    </div>
                </th>
                <th>
                    <input
                        v-model="filters.date.value"
                        list="filter-list-date"
                        placeholder="Date"
                        class="form-control"
                        style="max-width: 6em"
                    />
                    <datalist id="filter-list-date">
                        <option
                            v-for="date in new Set(
                                Array.from(Recordings, (rec) => rec.date)
                            )"
                            :key="date"
                        >
                            {{ date }}
                        </option>
                    </datalist>
                </th>
                <th></th>
                <th>
                    <input
                        v-model="filters.title.value"
                        list="filter-list-title"
                        placeholder="Title"
                        class="form-control"
                        style="max-width: 6em"
                    />
                    <datalist id="filter-list-title">
                        <option
                            v-for="title in new Set(
                                Array.from(Recordings, (rec) => rec.title)
                            )"
                            :key="title"
                        >
                            {{ title }}
                        </option>
                    </datalist>
                </th>
                <th>
                    <input
                        v-model="filters.type.value"
                        list="filter-list-type"
                        placeholder="Type"
                        class="form-control"
                        style="max-width: 6em"
                    />
                    <datalist id="filter-list-type">
                        <option
                            v-for="type in new Set(
                                Array.from(Recordings, (rec) => rec.type)
                            )"
                            :key="type"
                        >
                            {{ type }}
                        </option>
                    </datalist>
                </th>
                <th></th>
                <th v-if="!isMobile()">
                    <input
                        placeholder="Channels"
                        v-model="filters.instruments.value"
                        class="form-control"
                    />
                </th>
            </thead>
            <thead slot="head">
                <th>
                    <font-awesome-icon icon="fa-solid fa-music" />
                </th>
                <v-th sortKey="date" defaultSort="desc"> Date </v-th>
                <v-th sortKey="time">Time</v-th>
                <v-th sortKey="title"> Title</v-th>
                <th>Type</th>
                <th>#Ch</th>
                <th v-if="!isMobile()">Channels</th>
                <th>
                    <font-awesome-icon icon="fa-solid fa-right-left" />
                </th>
                <th>
                    <font-awesome-icon
                        class="fa-rotate-90"
                        icon="fa-solid fa-sliders"
                    />
                </th>
            </thead>
            <tbody slot="body" slot-scope="{ displayData }">
                <tr
                    v-for="row in displayData"
                    :key="row.id"
                    :class="{ 'table-light': row._id == mix_id }"
                >
                    <td>
                        <div>
                            <router-link
                                class="mx-auto d-block"
                                :to="'/view/' + row._id"
                                tag="button"
                                ><font-awesome-icon
                                    v-if="row._id != mix_id"
                                    icon="fa-solid fa-play" /><font-awesome-icon
                                    v-if="row._id == mix_id"
                                    icon="fa-solid fa-volume-high"
                            /></router-link>
                        </div>
                    </td>

                    <td>{{ row.date }}</td>
                    <td>{{ row.time_hhmm }}</td>
                    <td>{{ row.title }}</td>
                    <td>{{ row.type }}</td>
                    <td>
                        {{ Object.keys(row.channels).length }}
                    </td>
                    <td v-if="!isMobile()">{{ row.instruments }}</td>
                    <td>
                        <router-link
                            class="mx-auto d-block"
                            :to="'/view/' + row._id"
                            tag="button"
                            ><font-awesome-icon
                                v-if="row._id != mix_id"
                                icon="fa-solid fa-arrow-up-from-bracket" /><font-awesome-icon
                                v-if="row._id == mix_id"
                                icon="fa-solid fa-trash-arrow-up"
                        /></router-link>
                    </td>
                    <td>
                        <router-link
                            class="mx-auto d-block"
                            :to="'/view/' + row._id"
                            tag="button"
                            ><font-awesome-icon
                                v-if="row._id != mix_id"
                                icon="fa-solid fa-arrow-up-from-bracket" /><font-awesome-icon
                                v-if="row._id == mix_id"
                                icon="fa-solid fa-trash-arrow-up"
                        /></router-link>
                    </td>
                </tr>
            </tbody>
        </v-table>
        <smart-pagination
            :currentPage.sync="currentPage"
            :totalPages="totalPages"
        />
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            Recordings: [],
            filters: {
                date: { value: "", keys: ["date"] },
                title: { value: "", keys: ["title"] },
                type: { value: "", keys: ["type"] },
                instruments: { value: "", custom: this.instrumentsFilter },
            },
            currentPage: 1,
            totalPages: 0,
        };
    },
    props: ["mix_id"],
    created() {
        this.isMobile();
        let apiURL = `${window.location.origin
            .split(":")
            .slice(0, -1)
            .join(":")}:4000/api`;
        axios
            .get(apiURL)
            .then((res) => {
                this.Recordings = res.data;
            })
            .catch((error) => {
                console.log(error);
            });
    },
    computed: {},
    methods: {
        instrumentsFilter(filterValue, row) {
            return filterValue
                .split(",")
                .join(" ")
                .split(" ")
                .every((instr) => {
                    return row.instruments
                        .toLowerCase()
                        .includes(instr.toLowerCase());
                });
        },
        deleteRecording(id) {
            let apiURL = `${window.location.origin
                .split(":")
                .slice(0, -1)
                .join(":")}:4000/api/delete-recording/${id}`;
            let indexOfArrayItem = this.Recordings.findIndex(
                (i) => i._id === id
            );

            if (window.confirm("Do you really want to delete?")) {
                axios
                    .delete(apiURL)
                    .then(() => {
                        this.Recordings.splice(indexOfArrayItem, 1);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        },
        isMobile() {
            if (screen.width <= 760) {
                return true;
            } else {
                return false;
            }
        },
    },
};
</script>
<style>
thead th:not([class]) {
    vertical-align: middle;
    white-space: nowrap;
}
</style>