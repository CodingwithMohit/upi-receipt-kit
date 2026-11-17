# Challenge and library research

Research checked on 17 November 2026.

## Sources

- [Hyper Elements website](https://hyperelements.dev/)
- [Hyper Elements documentation](https://www.hyperelements.dev/docs)
- [Hyper Elements repository](https://github.com/hyper-elements/hyper-elements)
- [Unlayer Elements repository URL](https://github.com/unlayer/elements), which redirects to the current Hyper Elements repository
- [Challenge announcement](https://github.com/hyper-elements/hyper-elements/discussions/209)
- [Challenge FAQ](https://unlayer.notion.site/Hyper-Elements-Template-Challenge-FAQ-4170ceb4c8e180ddb512d69e3792585d)
- [Published package README, version 0.4.6](https://unpkg.com/@hyper-elements/react@0.4.6/README.md)
- [Published package GUIDE.md, version 0.4.6](https://unpkg.com/@hyper-elements/react@0.4.6/GUIDE.md)
- [Published package REFERENCE.md, version 0.4.6](https://unpkg.com/@hyper-elements/react@0.4.6/REFERENCE.md)
- [Package registry metadata](https://registry.npmjs.org/@hyper-elements%2freact/latest)

The package registry reported `@hyper-elements/react` version `0.4.6` as latest. The GitHub URL formerly used for Unlayer Elements redirects to the renamed Hyper Elements project. The installed package name is **`@hyper-elements/react`**, not `@unlayer/react-elements`.

Install the exact version verified during this research:

```bash
npm install @hyper-elements/react@0.4.6 react react-dom
```

The repository's current branch package manifest reports an older version than the npm registry. This project pins the published registry version, `0.4.6`.

## Components and root props

The package requires one root component per template. The root selects the output kind. Styles belong in `style={{ ... }}`, not as root props.

| Root | Relevant props verified in `REFERENCE.md` | Output |
|---|---|---|
| `Email` | `width` (default 600), `previewText`, `title`, `lang`, `dir`, `fonts`, and `style` | Email-safe HTML and plain text |
| `Page` | `width` (default 1200), `description`, `breakpoints`, `title`, `lang`, `dir`, `fonts`, and `style` | Responsive HTML without client-side JavaScript |
| `Document` | `size` (`A3`, `A4`, `A5`, `Letter`, `Legal`, `Tabloid`), `orientation` (`portrait` or `landscape`), `margin` (insets in CSS px), `title`, `lang`, `dir`, `fonts`, and `style` | Print-ready HTML |

`Document` can also contain `PageHeader`, `PageFooter`, `PageNumber`, `PageBreak`, and `Document.Page`. Content does not automatically flow between pages, so the document must fit its page or be split explicitly.

## Render functions

- Import `render` from `@hyper-elements/react`: `const { html, text, diagnostics } = await render(element)`. It accepts a root element and returns the output HTML, text output, and diagnostics. Errors reject with `ElementsError`.
- `validate(element)` checks a template without rendering, and `outline(element)` provides a text outline.
- `renderToHtml` is not the documented API in the version checked.
- `renderPdf(element, options)` is available from `@hyper-elements/react/pdf` and returns `{ pdf, diagnostics }`. The package's PDF guide uses `@react-pdf/renderer`.
- This project will use the challenge brief's requested browser route: render a `Document` to print HTML, load that HTML with Playwright, then write the PDF with `page.pdf()`.

## Challenge requirements and rules

The announcement asks builders to:

1. Build an original template using Hyper Elements.
2. Publish source in a public GitHub repository with a clear README.
3. Star the Hyper Elements repository.
4. Submit the project through the official Challenge Submissions discussion category.

The README must include a screenshot, GIF, or video of the completed template, explain how Hyper Elements was used, and give instructions to run or reproduce the project. There is no submission limit, team submissions are allowed, and a live deployment is not required.

The announcement describes five awards of $100 each, with winning templates added to the template gallery and featured on Unlayer social channels. The deadline is **29 November 2026 at 23:59 UTC**. The announcement lists the start date as 16 November 2026.

The accessible FAQ describes this as a two-week competition for developers to create original templates, says there are no predefined themes or categories, and says five winners receive $100 and gallery placement. No age, location, employment, or other eligibility restrictions are stated in the accessible FAQ or announcement.

The announcement and accessible FAQ do not state a project license requirement or transfer of rights. The library itself is MIT licensed. This project will use MIT as requested in the brief, without treating that as a challenge rule.

The announcement does not give a required title/body template for the Discussion post. It specifies the submission category and README contents. `SUBMISSION.md` will use the requested title, short description, repository placeholder, screenshot list, and run instructions, while linking to the official category.

## Judging criteria

Unlayer's core team evaluates:

- Originality
- Design quality
- Practical value
- Effective use of Hyper Elements
- Overall execution

Technical complexity alone does not determine the winners.

## Common mistakes in the package guide

The versioned `GUIDE.md` calls out these first-try mistakes:

- Put styles in `style={{ ... }}`, not props such as `backgroundColor`.
- Put root width in `Email width={...}` or `Page width={...}`. A root has no padding; pad an inner `Column` or `Section`.
- Use `gap` on a parent for spacing. The library does not use margins.
- Use the new props and elements, not the old Unlayer Elements API. For example, use `level`, `alt`, and text children rather than `headingType`, `altText`, or an `html` prop.
- Use an image `src` object with its source dimensions and provide `alt`.
- Put mobile and hover styles inside `style={{ mobile: ..., hover: ... }}`.
- Use `href`, not `link`, for `Menu` items.
- Render a synchronous template tree. Fetch data before creating it; async or suspending template components are errors.
- Pass dynamic values as text or props so the renderer can escape them. Validate link targets.

