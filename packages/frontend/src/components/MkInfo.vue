<!--
SPDX-FileCopyrightText: syuilo and other misskey contributors
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<div :class="[$style.root, { [$style.warn]: warn }]">
	<i v-if="warn" class="ph-warning ph-bold ph-lg" :class="$style.i"></i>
	<i v-else class="ph-info ph-bold ph-lg" :class="$style.i"></i>
	<slot></slot>
</div>
</template>

<script lang="ts" setup>
import { } from 'vue';

const props = defineProps<{
	warn?: boolean;
}>();
</script>

<style lang="scss" module>
.root {
	padding: 12px 14px;
	font-size: 90%;
	background: var(--infoBg);
	color: var(--infoFg);
	border-radius: var(--radius);
	white-space: pre-wrap;

	&.warn {
		background: var(--infoWarnBg);
		color: var(--infoWarnFg);
	}
}

.i {
	margin-right: 4px;
}
</style>
