<template>
    <el-select
        :value="selectedValue"
        placeholder="Sort option"
        :disabled="disableInputs"
        v-on:change="$emit('sort-table', $event)">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
    </el-select>
</template>

<script>
    export default {
        data() {
            return {
                options: [{
                    value: 'id_ascending',
                    label: 'ID Asc'
                }, {
                    value: 'id_descending',
                    label: 'ID Desc'
                }, {
                    value: 'name_ascending',
                    label: 'Name Asc'
                }, {
                    value: 'name_descending',
                    label: 'Name Desc'
                }]
            }
        },
        props: ['disableInputs', 'selectedValue']
    }
</script>

<style>
    input{
        font-family: Verdana;
        font-weight: bold;
    }
</style>
