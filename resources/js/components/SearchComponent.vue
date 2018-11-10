<template>
    <el-input
        v-on:input="$emit('filter-table', $event)"
        :disabled="disableInputs"
        :value="filter"
        size="medium"
        :span="6"
        placeholder="Search">
    </el-input>
</template>

<script>
    export default {
        name: 'table-search',
        props: ['disableInputs', 'filter']
    }
</script>
