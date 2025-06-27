<script setup>
  import tailwindConfig from '@base/tailwind.config.js'

  const colors = Object.entries(tailwindConfig.theme.colors).flatMap(([colorKey, colorValue]) => {
    if (typeof colorValue === 'object') {
      return Object.entries(colorValue).map(([shadeKey, hexValue]) => {
        const label = shadeKey === 'DEFAULT' ? colorKey : `${colorKey}-${shadeKey}`;
        return { label, hex: hexValue };
      });
    } else {
      return [{ label: colorKey, hex: colorValue }];
    }
  })
</script>

# Design System Overview

Welcome to our comprehensive Design System, the foundational framework that encapsulates our commitment to creating cohesive, impactful, and user-centric digital experiences. This system is meticulously crafted, serving as the cornerstone for design consistency, efficiency, and scalability across our products.

The design system takes heavy reference from the video game industry, focusing on colorful and bubbly designs that are both fun and engaging.

We use Tailwind CSS as our primary styling framework, which allows us to create a consistent and cohesive design language that is both accessible and adaptable. All design principles outlined below are defined explicitly within the Tailwind CSS configuration, ensuring that the design system is seamlessly integrated into our application.

## Color Palette

Use Tailwind's color utility classes to apply text, background, border, and other color styles directly to HTML elements.
Tailwind’s naming convention simplifies the application of colors, e.g., `bg-blue` for backgrounds or `text-red` for text.

The palette is constrained to the colors below and is designed to be accessible and adaptable, ensuring consistency across different components and layouts.

<div class="grid grid-cols-7 gap-2 py-10">
  <div v-for="color in colors" :key="color.label">
      <div class=" w-full h-12 rounded-[8px]" :style="{ backgroundColor: color.hex }"></div>
      <div class="font-medium text-base text-grey-dark">{{ color.label }}</div>
      <div class="text-sm text-grey">{{ color.hex }}</div>
    </div>
</div>

## Typography

The application only uses 2 typefaces of various sizes and weights. The primary typeface is "Arial Rounded MT Bold", which is used for the majority of text in the application such as headings and button text. The secondary typeface is "Assistant", which is used for supplimentary text such as descriptions.

An exhaustive list of all the typefaces and their respective sizes and weights are illustrated below:

### Primary Typefaces

### Secondary Typefaces

## Spacing

The application uses a variety of spacing styles to create a consistent and cohesive design language. The spacing styles are defined explicitly within the Tailwind CSS configuration, ensuring that the design system is seamlessly integrated into our application.

## Borders

The application uses a variety of border styles to create a consistent and cohesive design language. The border styles are defined explicitly within the Tailwind CSS configuration, ensuring that the design system is seamlessly integrated into our application.

### Border Styles

### Border Radii

## Shadows

The application uses a variety of shadow styles to create a consistent and cohesive design language. The shadow styles are defined explicitly within the Tailwind CSS configuration, ensuring that the design system is seamlessly integrated into our application.
