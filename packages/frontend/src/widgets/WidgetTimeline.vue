<!--
SPDX-FileCopyrightText: syuilo and other misskey contributors
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<MkContainer :showHeader="widgetProps.showHeader" :style="`height: ${widgetProps.height}px;`" :scrollable="true" data-cy-mkw-timeline class="mkw-timeline">
	<template #icon>
		<i v-if="widgetProps.src === 'home'" class="ph-house ph-bold ph-lg"></i>
		<i v-else-if="widgetProps.src === 'local'" class="ph-planet ph-bold pg-lg"></i>
		<i v-else-if="widgetProps.src === 'social'" class="ph-rocket-launch ph-bold pg-lg"></i>
		<i v-else-if="widgetProps.src === 'global'" class="ph-globe-hemisphere-west ph-bold ph-lg"></i>
		<i v-else-if="widgetProps.src === 'list'" class="ph-list ph-bold pg-lg"></i>
		<i v-else-if="widgetProps.src === 'antenna'" class="ph-flying-saucer ph-bold pg-lg"></i>
	</template>
	<template #header>
		<button class="_button" @click="choose">
			<span>{{ widgetProps.src === 'list' ? widgetProps.list.name : widgetProps.src === 'antenna' ? widgetProps.antenna.name : i18n.t('_timelines.' + widgetProps.src) }}</span>
			<i :class="menuOpened ? 'ph-caret-up ph-bold ph-lg' : 'ph-caret-down ph-bold ph-lg'" style="margin-left: 8px;"></i>
		</button>
	</template>

	<div v-if="(((widgetProps.src === 'local' || widgetProps.src === 'social') && !isLocalTimelineAvailable) || (widgetProps.src === 'global' && !isGlobalTimelineAvailable))" :class="$style.disabled">
		<p :class="$style.disabledTitle">
			<i class="ph-minus ph-bold ph-lg"></i>
			{{ i18n.ts._disabledTimeline.title }}
		</p>
		<p :class="$style.disabledDescription">{{ i18n.ts._disabledTimeline.description }}</p>
	</div>
	<div v-else>
		<MkTimeline :key="widgetProps.src === 'list' ? `list:${widgetProps.list.id}` : widgetProps.src === 'antenna' ? `antenna:${widgetProps.antenna.id}` : widgetProps.src" :src="widgetProps.src" :list="widgetProps.list ? widgetProps.list.id : null" :antenna="widgetProps.antenna ? widgetProps.antenna.id : null"/>
	</div>
</MkContainer>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useWidgetPropsManager, Widget, WidgetComponentEmits, WidgetComponentExpose, WidgetComponentProps } from './widget';
import { GetFormResultType } from '@/scripts/form.js';
import * as os from '@/os.js';
import MkContainer from '@/components/MkContainer.vue';
import MkTimeline from '@/components/MkTimeline.vue';
import { i18n } from '@/i18n.js';
import { $i } from '@/account.js';
import { instance } from '@/instance.js';

const name = 'timeline';
const isLocalTimelineAvailable = (($i == null && instance.policies.ltlAvailable) || ($i != null && $i.policies.ltlAvailable));
const isGlobalTimelineAvailable = (($i == null && instance.policies.gtlAvailable) || ($i != null && $i.policies.gtlAvailable));

const widgetPropsDef = {
	showHeader: {
		type: 'boolean' as const,
		default: true,
	},
	height: {
		type: 'number' as const,
		default: 300,
	},
	src: {
		type: 'string' as const,
		default: 'home',
		hidden: true,
	},
	antenna: {
		type: 'object' as const,
		default: null,
		hidden: true,
	},
	list: {
		type: 'object' as const,
		default: null,
		hidden: true,
	},
};

type WidgetProps = GetFormResultType<typeof widgetPropsDef>;

const props = defineProps<WidgetComponentProps<WidgetProps>>();
const emit = defineEmits<WidgetComponentEmits<WidgetProps>>();

const { widgetProps, configure, save } = useWidgetPropsManager(name,
	widgetPropsDef,
	props,
	emit,
);

const menuOpened = ref(false);

const setSrc = (src) => {
	widgetProps.src = src;
	save();
};

const choose = async (ev) => {
	menuOpened.value = true;
	const [antennas, lists] = await Promise.all([
		os.api('antennas/list'),
		os.api('users/lists/list'),
	]);
	const antennaItems = antennas.map(antenna => ({
		text: antenna.name,
		icon: 'ph-flying-saucer ph-bold pg-lg',
		action: () => {
			widgetProps.antenna = antenna;
			setSrc('antenna');
		},
	}));
	const listItems = lists.map(list => ({
		text: list.name,
		icon: 'ph-list ph-bold pg-lg',
		action: () => {
			widgetProps.list = list;
			setSrc('list');
		},
	}));
	os.popupMenu([{
		text: i18n.ts._timelines.home,
		icon: 'ph-house ph-bold ph-lg',
		action: () => { setSrc('home'); },
	}, {
		text: i18n.ts._timelines.local,
		icon: 'ph-planet ph-bold pg-lg',
		action: () => { setSrc('local'); },
	}, {
		text: i18n.ts._timelines.social,
		icon: 'ph-rocket-launch ph-bold pg-lg',
		action: () => { setSrc('social'); },
	}, {
		text: i18n.ts._timelines.global,
		icon: 'ph-globe-hemisphere-west ph-bold ph-lg',
		action: () => { setSrc('global'); },
	}, antennaItems.length > 0 ? null : undefined, ...antennaItems, listItems.length > 0 ? null : undefined, ...listItems], ev.currentTarget ?? ev.target).then(() => {
		menuOpened.value = false;
	});
};

defineExpose<WidgetComponentExpose>({
	name,
	configure,
	id: props.widget ? props.widget.id : null,
});
</script>

<style lang="scss" module>
.disabled {
	text-align: center;
}

.disabledTitle {
	margin: 16px;
}

.disabledDescription {
	font-size: 90%;
}
</style>
