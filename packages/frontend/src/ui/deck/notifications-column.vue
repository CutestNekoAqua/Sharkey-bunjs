<!--
SPDX-FileCopyrightText: syuilo and other misskey contributors
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<XColumn :column="column" :isStacked="isStacked" :menu="menu">
	<template #header><i class="ph-bell ph-bold pg-lg" style="margin-right: 8px;"></i>{{ column.name }}</template>

	<XNotifications :includeTypes="column.includingTypes"/>
</XColumn>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue';
import XColumn from './column.vue';
import { updateColumn, Column } from './deck-store.js';
import XNotifications from '@/components/MkNotifications.vue';
import * as os from '@/os.js';
import { i18n } from '@/i18n.js';

const props = defineProps<{
	column: Column;
	isStacked: boolean;
}>();

function func() {
	os.popup(defineAsyncComponent(() => import('@/components/MkNotificationSettingWindow.vue')), {
		includingTypes: props.column.includingTypes,
	}, {
		done: async (res) => {
			const { includingTypes } = res;
			updateColumn(props.column.id, {
				includingTypes: includingTypes,
			});
		},
	}, 'closed');
}

const menu = [{
	icon: 'ph-pencil ph-bold ph-lg',
	text: i18n.ts.notificationSetting,
	action: func,
}];
</script>
