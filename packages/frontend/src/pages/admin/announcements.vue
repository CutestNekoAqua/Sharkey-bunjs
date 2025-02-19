<!--
SPDX-FileCopyrightText: syuilo and other misskey contributors
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<MkStickyContainer>
	<template #header><XHeader :actions="headerActions" :tabs="headerTabs"/></template>
	<MkSpacer :contentMax="900">
		<div class="_gaps">
			<MkInfo v-if="announcements.length > 5" warn>{{ i18n.ts._announcement.tooManyActiveAnnouncementDescription }}</MkInfo>

			<MkFolder v-for="announcement in announcements" :key="announcement.id ?? announcement._id" :defaultOpen="announcement.id == null">
				<template #label>{{ announcement.title }}</template>
				<template #icon>
					<i v-if="announcement.icon === 'info'" class="ph-info ph-bold ph-lg"></i>
					<i v-else-if="announcement.icon === 'warning'" class="ph-warning ph-bold ph-lg" style="color: var(--warn);"></i>
					<i v-else-if="announcement.icon === 'error'" class="ph-x-circle ph-bold ph-lg" style="color: var(--error);"></i>
					<i v-else-if="announcement.icon === 'success'" class="ph-check ph-bold ph-lg" style="color: var(--success);"></i>
				</template>
				<template #caption>{{ announcement.text }}</template>

				<div class="_gaps_m">
					<MkInput v-model="announcement.title">
						<template #label>{{ i18n.ts.title }}</template>
					</MkInput>
					<MkTextarea v-model="announcement.text">
						<template #label>{{ i18n.ts.text }}</template>
					</MkTextarea>
					<MkInput v-model="announcement.imageUrl">
						<template #label>{{ i18n.ts.imageUrl }}</template>
					</MkInput>
					<MkRadios v-model="announcement.icon">
						<template #label>{{ i18n.ts.icon }}</template>
						<option value="info"><i class="ph-info ph-bold ph-lg"></i></option>
						<option value="warning"><i class="ph-warning ph-bold ph-lg" style="color: var(--warn);"></i></option>
						<option value="error"><i class="ph-x-circle ph-bold ph-lg" style="color: var(--error);"></i></option>
						<option value="success"><i class="ph-check ph-bold ph-lg" style="color: var(--success);"></i></option>
					</MkRadios>
					<MkRadios v-model="announcement.display">
						<template #label>{{ i18n.ts.display }}</template>
						<option value="normal">{{ i18n.ts.normal }}</option>
						<option value="banner">{{ i18n.ts.banner }}</option>
						<option value="dialog">{{ i18n.ts.dialog }}</option>
					</MkRadios>
					<MkSwitch v-model="announcement.forExistingUsers" :helpText="i18n.ts._announcement.forExistingUsersDescription">
						{{ i18n.ts._announcement.forExistingUsers }}
					</MkSwitch>
					<MkSwitch v-model="announcement.needConfirmationToRead" :helpText="i18n.ts._announcement.needConfirmationToReadDescription">
						{{ i18n.ts._announcement.needConfirmationToRead }}
					</MkSwitch>
					<p v-if="announcement.reads">{{ i18n.t('nUsersRead', { n: announcement.reads }) }}</p>
					<div class="buttons _buttons">
						<MkButton class="button" inline primary @click="save(announcement)"><i class="ph-floppy-disk ph-bold pg-lg"></i> {{ i18n.ts.save }}</MkButton>
						<MkButton v-if="announcement.id != null" class="button" inline @click="archive(announcement)"><i class="ph-check ph-bold ph-lg"></i> {{ i18n.ts._announcement.end }} ({{ i18n.ts.archive }})</MkButton>
						<MkButton v-if="announcement.id != null" class="button" inline danger @click="del(announcement)"><i class="ph-trash ph-bold ph-lg"></i> {{ i18n.ts.delete }}</MkButton>
					</div>
				</div>
			</MkFolder>
			<MkButton class="button" @click="more()">
				<i class="ph-arrow-clockwise ph-bold ph-lg"></i>{{ i18n.ts.more }}
			</MkButton>
		</div>
	</MkSpacer>
</MkStickyContainer>
</template>

<script lang="ts" setup>
import { } from 'vue';
import XHeader from './_header_.vue';
import MkButton from '@/components/MkButton.vue';
import MkInput from '@/components/MkInput.vue';
import MkTextarea from '@/components/MkTextarea.vue';
import MkSwitch from '@/components/MkSwitch.vue';
import MkRadios from '@/components/MkRadios.vue';
import MkInfo from '@/components/MkInfo.vue';
import * as os from '@/os.js';
import { i18n } from '@/i18n.js';
import { definePageMetadata } from '@/scripts/page-metadata.js';
import MkFolder from '@/components/MkFolder.vue';

let announcements: any[] = $ref([]);

os.api('admin/announcements/list').then(announcementResponse => {
	announcements = announcementResponse;
});

function add() {
	announcements.unshift({
		_id: Math.random().toString(36),
		id: null,
		title: 'New announcement',
		text: '',
		imageUrl: null,
		icon: 'info',
		display: 'normal',
		forExistingUsers: false,
		needConfirmationToRead: false,
	});
}

function del(announcement) {
	os.confirm({
		type: 'warning',
		text: i18n.t('deleteAreYouSure', { x: announcement.title }),
	}).then(({ canceled }) => {
		if (canceled) return;
		announcements = announcements.filter(x => x !== announcement);
		os.api('admin/announcements/delete', announcement);
	});
}

async function archive(announcement) {
	await os.apiWithDialog('admin/announcements/update', {
		...announcement,
		isActive: false,
	});
	refresh();
}

async function save(announcement) {
	if (announcement.id == null) {
		await os.apiWithDialog('admin/announcements/create', announcement);
		refresh();
	} else {
		os.apiWithDialog('admin/announcements/update', announcement);
	}
}

function more() {
	os.api('admin/announcements/list', { untilId: announcements.reduce((acc, announcement) => announcement.id != null ? announcement : acc).id }).then(announcementResponse => {
		announcements = announcements.concat(announcementResponse);
	});
}

function refresh() {
	os.api('admin/announcements/list').then(announcementResponse => {
		announcements = announcementResponse;
	});
}

refresh();

const headerActions = $computed(() => [{
	asFullButton: true,
	icon: 'ph-plus ph-bold ph-lg',
	text: i18n.ts.add,
	handler: add,
}]);

const headerTabs = $computed(() => []);

definePageMetadata({
	title: i18n.ts.announcements,
	icon: 'ph-megaphone ph-bold ph-lg',
});
</script>
