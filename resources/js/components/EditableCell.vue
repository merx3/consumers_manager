<template>
    <div  v-if="isEditable">
        <el-input
            :type="type"
            :placeholder="prop.capitalize()"
            v-model="inputModel[prop]"
            :disabled="disableInputs"
            class="edit-field">
        </el-input>
        <i class="el-icon-success" v-if="!disableInputs && !row.new" v-on:click="$emit('stop-edit', true)"></i>
        <i class="el-icon-error" v-if="!row.new" v-on:click="$emit('stop-edit', false)"></i>
    </div>
    <div v-else
         v-on:dblclick="$emit('edit-cell', { id: row.id, [prop]: row[prop], prop: prop})">
        <span>
            {{row[prop]}}
        </span>
    </div>
</template>

<script>
    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };
    export default {
        name: 'table-editable-cell',
        props: ['editConsumer', 'row', 'prop', 'type', 'disableInputs'],
        computed: {
            isEditable() {
                return this.row.new ||
                    (
                        Object.keys(this.editConsumer).length &&
                        this.editConsumer.id === this.row.id &&
                        this.editConsumer.prop === this.prop
                    );
            },
            inputModel() {
                return this.row.new ? this.row : this.editConsumer;
            }
        }
    }
</script>

<style lang="less">
    .edit-field {
        width: -webkit-calc(100% - 100px);
        width: -moz-calc(100% - 100px);
        width: calc(100% - 3em);
    }

    input[type="number"] {
        -moz-appearance: textfield;
        &::-webkit-outer-spin-button, &::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
    }
</style>
