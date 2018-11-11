<template>
    <div id="app">
        <el-row type="flex">
            <div class="table-actions centered">
                <el-col :offset="2" :span="8" >
                    <table-search
                        v-bind:disable-inputs="$store.getters.disableInputs"
                        v-on:filter-table="filterTable"
                        v-bind:filter="filter">
                    </table-search>
                </el-col>
                <el-col :offset="4" :span="8" align="right">
                    <table-sort
                        ref="tableSort"
                        v-bind:disable-inputs="$store.getters.disableInputs"
                        v-bind:selected-value="sort"
                        v-on:sort-table="sortTable">
                    </table-sort>
                </el-col>
            </div>
        </el-row>
        <el-row type="flex">
            <el-col :offset="4" :span="16">
            <el-table
                :data="consumers"
                empty-text="No consumers found"
                ref="consumersTable"
                sortable="custom"
                class="consumers-table centered">
                <el-table-column
                    label="#"
                    prop="id"
                    :sortMethod="sortById"
                    width="50">
                </el-table-column>
                <el-table-column
                    label="Name"
                    prop="name"
                    :sortMethod="sortByName"
                    width="200">
                    <template slot-scope="scope">
                        <editable-cell
                            prop="name"
                            type="text"
                            v-bind:edit-consumer="editConsumer"
                            v-bind:disable-inputs="$store.getters.disableInputs"
                            v-bind:class="{'name-color-red': scope.row.age > 60, 'name-color-green': scope.row.age < 18 }"
                            v-bind:row="scope.row"
                            v-on:edit-cell="editCell"
                            v-on:stop-edit="stopEdit"
                            ></editable-cell>
                    </template>
                </el-table-column>
                <el-table-column
                    label="Age"
                    width="125">
                    <template slot-scope="scope">
                        <editable-cell
                            prop="age"
                            type="number"
                            v-bind:edit-consumer="editConsumer"
                            v-bind:disable-inputs="$store.getters.disableInputs"
                            v-bind:row="scope.row"
                            v-on:edit-cell="editCell"
                            v-on:stop-edit="stopEdit"
                        ></editable-cell>
                    </template>
                </el-table-column>
                <el-table-column
                    label="City"
                    width="150">
                    <template slot-scope="scope">
                        <editable-cell
                            prop="city"
                            type="text"
                            v-bind:edit-consumer="editConsumer"
                            v-bind:disable-inputs="$store.getters.disableInputs"
                            v-bind:row="scope.row"
                            v-on:edit-cell="editCell"
                            v-on:stop-edit="stopEdit"
                        ></editable-cell>
                    </template>
                </el-table-column>
                <el-table-column
                    label="Actions"
                    align="right">
                    <template slot-scope="scope">
                        <el-button
                            v-if="!scope.row.new"
                            size="medium"
                            :disabled="$store.getters.disableInputs"
                            @click="handleDelete(scope.row)">Delete</el-button>
                        <el-button
                            v-if="scope.row.new"
                            size="medium"
                            :disabled="$store.getters.disableInputs"
                            class="add-button"
                            @click="handleAdd(scope.row)">Add User</el-button>
                    </template>
                </el-table-column>
            </el-table>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import SearchComponent from './components/SearchComponent.vue';
    import SortComponent from './components/SortComponent.vue';
    import EditableCell from './components/EditableCell.vue';

    export default {
        components: {
            'editable-cell': EditableCell,
            'table-search': SearchComponent,
            'table-sort': SortComponent
        },
        data() {
            return {
                editConsumer: {},
                sort: 'id_ascending',
                filter: ''
            }
        },
        computed: {
            consumers: {
                get () {
                    let consumers = this.$store.getters.all;
                    if (!this.filter) {
                        return consumers;
                    } else {
                        return consumers.filter(c => {
                            let include = c.new ||
                                c.name.toLowerCase().includes(this.filter) ||
                                c.city.toLowerCase().includes(this.filter) ||
                                c.age.toString().toLowerCase().includes(this.filter);
                            return include;
                        });
                    }
                },
                set (v) { this.$store.commit('set', v) }
            }
        },
        methods: {
            genericSort(a, b, prop) {
                let sortOrder = this.sort.split('_')[1];
                if (b.new === true) {
                    return sortOrder === 'descending';
                }
                if (a[prop] > b[prop]) {
                    return 1;
                }
                if (a[prop] < b[prop]) {
                    return -1;
                }
                return 0;

            },
            sortById(a, b) {
                return this.genericSort(a, b, 'id');
            },
            sortByName(a, b) {
                return this.genericSort(a, b, 'name');
            },
            handleDelete(consumer){
                this.$store.dispatch('delete', consumer.id)
                    .catch(error => {
                        this.$message({
                            showClose: true,
                            message: error,
                            type: 'error'
                        });
                    });
            },
            handleAdd(consumer){
                this.$store.dispatch('save', consumer)
                    .then(saved => {
                        consumer.new = false; // trigger reactive behaviour in components
                        delete consumer.new;
                        this.$store.commit('add', {new: true});
                        this.filter = '';
                        this.sort = 'id_ascending';
                    })
                    .catch(errorMsg => {
                        this.$message({
                            showClose: true,
                            message: errorMsg,
                            type: 'error'
                        });
                    });;
            },
            filterTable(text){
                this.filter = text.toLowerCase();
            },
            sortTable(prop) {
                this.sort = prop;
                let sortVals = prop.split('_');
                this.$refs.consumersTable.sort(sortVals[0], sortVals[1]);
            },
            editCell(event) {
                this.editConsumer = event;
            },
            stopEdit(save) {
                if (save) {
                    let consumer = this.consumers.find(c => c.id == this.editConsumer.id);
                    consumer = Object.assign({}, consumer);
                    let prop = this.editConsumer.prop;
                    consumer[prop] = this.editConsumer[prop];
                    this.$store.dispatch('save', consumer)
                        .then(result => this.editConsumer = {})
                        .catch(errorMsg => {
                            this.$message({
                                showClose: true,
                                message: errorMsg,
                                type: 'error'
                            });
                        });
                } else {
                    this.editConsumer = {};
                }
            }
        },
        beforeMount(){
            this.$store.dispatch('fetch').then(() => {
                this.$store.commit('add', {new: true});
            });
        }
    }
</script>


<style lang="less">
    @font:         Verdana;
    @font-weight: bold;

    .el-row {
        margin-bottom: 2em;
        &:first-child {
            margin-top: 5em;
        }
    }

    @colors: green, red;

    .age-groups(@list, @i: 1) when (@i <= length(@list)) {
        @color: extract(@list, @i);

        .name-color-@{color} span {
            color: @color;
        }

        .age-groups(@list, @i + 1);
    }

    .age-groups(@colors);

    button {
        font-family: @font;
    }

    table, input::placeholder, li > span {
        font-family: @font;
        font-weight: @font-weight;
        opacity: 1;
    }

    .cell i {
        cursor: pointer;
    }

    .centered {
        margin-left:auto;
        margin-right:auto;
    }

    .table-actions {
        width: 40em;
    }

    .consumers-table {
        width: 45em;
    }

    .add-button {
        padding: 0.8em;
    }
</style>
