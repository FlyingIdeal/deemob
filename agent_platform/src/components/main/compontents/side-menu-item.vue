<template>
    <Submenu :name="`${parentName}`">
        <template slot="title">
            <span :class="parentItem.icon"></span>
            <span class="in-title">{{ showTitle(parentItem) }}</span>
        </template>
        <template v-for="item in children">
            <template v-if="item.children && item.children.length === 1">
                <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
                <menu-item v-else :name="getNameOrHref(item, true)" :key="`menu-${item.children[0].name}`"><span class="in-title">{{ showTitle(item.children[0]) }}</span></menu-item>
            </template>
            <template v-else>
                <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
                <menu-item v-else :to="getPathOrHref(item)" :name="getNameOrHref(item)" :key="`menu-${item.name}`"><span><Icon v-if="item.icon" :type="item.icon" />{{ showTitle(item) }}</span></menu-item>
            </template>
        </template>
    </Submenu>
</template>
<script>
import mixin from './mixin'
import itemMixin from './item-mixin'
export default {
    name: 'SideMenuItem',
    mixins: [mixin, itemMixin]
}
</script>
