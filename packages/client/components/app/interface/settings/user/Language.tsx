import { For, Match, Switch, createMemo } from "solid-js";

import { Languages, browserPreferredLanguage, language } from "@revolt/i18n";
import { UnicodeEmoji } from "@revolt/markdown/emoji";
import {
  CategoryButton,
  CategoryButtonGroup,
  CategoryCollapse,
  Checkbox,
  Column,
  FormGroup,
  Row,
  Time,
  iconSize,
} from "@revolt/ui";

import MdErrorFill from "@material-design-icons/svg/filled/error.svg?component-solid";
import MdVerifiedFill from "@material-design-icons/svg/filled/verified.svg?component-solid";
import MdCalendarMonth from "@material-design-icons/svg/outlined/calendar_month.svg?component-solid";
import MdKeyboardTab from "@material-design-icons/svg/outlined/keyboard_tab.svg?component-solid";
import MdKeyboardTabRtl from "@material-design-icons/svg/outlined/keyboard_tab.svg?component-solid";
import MdLanguage from "@material-design-icons/svg/outlined/language.svg?component-solid";
import MdSchedule from "@material-design-icons/svg/outlined/schedule.svg?component-solid";
import MdTranslate from "@material-design-icons/svg/outlined/translate.svg?component-solid";
import { Trans } from "@lingui-solid/solid/macro";

/**
 * Language
 */
export default function Language() {
  return (
    <Column gap="lg">
      <CategoryButtonGroup>
        <PickLanguage />
        {/* <ConfigureRTL /> */}
      </CategoryButtonGroup>
      {/* <CategoryButtonGroup>
        <PickDateFormat />
        <PickTimeFormat />
      </CategoryButtonGroup> */}
      <CategoryButtonGroup>
        <ContributeLanguageLink />
      </CategoryButtonGroup>
    </Column>
  );
}

/**
 * Pick user's preferred language
 */
function PickLanguage() {
  /**
   * Determine the current language
   */
  const currentLanguage = () => Languages[language()];

  // Generate languages array.
  const languages = createMemo(() => {
    const languages = Object.keys(Languages).map(
      (x) => [x, Languages[x as keyof typeof Languages]] as const
    );

    const preferredLanguage = browserPreferredLanguage();

    if (preferredLanguage) {
      // This moves the user's system language to the top of the language list
      const prefLangKey = languages.find(
        (lang) => lang[0].replace(/_/g, "-") == preferredLanguage
      );

      if (prefLangKey) {
        languages.splice(
          0,
          0,
          languages.splice(languages.indexOf(prefLangKey), 1)[0]
        );
      }
    }

    return languages;
  });

  return (
    <CategoryCollapse
      icon={<MdLanguage {...iconSize(22)} />}
      title={<Trans>Select your language</Trans>}
      description={currentLanguage().display}
      scrollable
    >
      <For each={languages()}>
        {([id, lang]) => (
          <CategoryButton
            icon={<UnicodeEmoji emoji={lang.emoji} />}
            action={<Checkbox value={id === language()} />}
            onClick={() => setLanguage(id as never)}
          >
            <Row>
              {lang.display}{" "}
              {lang.verified && (
                <MdVerifiedFill
                  {...iconSize(18)}
                  fill="var(--colours-foreground)"
                />
              )}{" "}
              {lang.incomplete && (
                <MdErrorFill
                  {...iconSize(18)}
                  fill="var(--colours-foreground)"
                />
              )}
            </Row>
          </CategoryButton>
        )}
      </For>
    </CategoryCollapse>
  );
}

/**
 * Pick user's preferred date format
 */
function PickDateFormat() {
  const LastWeek = new Date();
  LastWeek.setDate(LastWeek.getDate() - 7);

  return (
    <CategoryCollapse
      icon={<MdCalendarMonth {...iconSize(22)} />}
      title="Select date format"
      description={`Traditional`}
    >
      <FormGroup>
        <CategoryButton
          icon={"blank"}
          onClick={() => void 0}
          action={<Checkbox value />}
          description={<Time format="date" value={LastWeek} />}
        >
          <Trans>Traditional (DD/MM/YYYY)</Trans>
        </CategoryButton>
      </FormGroup>
      <FormGroup>
        <CategoryButton
          icon={"blank"}
          onClick={() => void 0}
          action={<Checkbox />}
          description={<Time format="dateAmerican" value={LastWeek} />}
        >
          <Trans>American (MM/DD/YYYY)</Trans>
        </CategoryButton>
      </FormGroup>
      <FormGroup>
        <CategoryButton
          icon={"blank"}
          onClick={() => void 0}
          action={<Checkbox />}
          description={<Time format="iso8601" value={LastWeek} />}
        >
          <Trans>ISO8601 (YYYY/MM/DD)</Trans>
        </CategoryButton>
      </FormGroup>
    </CategoryCollapse>
  );
}

/**
 * Pick user's preferred time format
 */
function PickTimeFormat() {
  return (
    <CategoryCollapse
      icon={<MdSchedule {...iconSize(22)} />}
      title="Select time format"
      description={`24 hours`}
    >
      <FormGroup>
        <CategoryButton
          icon={"blank"}
          onClick={() => void 0}
          action={<Checkbox value />}
          description={<Time format="time24" value={new Date()} />}
        >
          <Trans>24 hours</Trans>
        </CategoryButton>
      </FormGroup>
      <FormGroup>
        <CategoryButton
          icon={"blank"}
          onClick={() => void 0}
          action={<Checkbox />}
          description={<Time format="time12" value={new Date()} />}
        >
          <Trans>12 hours</Trans>
        </CategoryButton>
      </FormGroup>
    </CategoryCollapse>
  );
}

/**
 * Configure right-to-left display
 */
function ConfigureRTL() {
  /**
   * Determine the current language
   */
  const currentLanguage = () => Languages[language()];

  return (
    <Switch
      fallback={
        <CategoryButton
          icon={<MdKeyboardTabRtl {...iconSize(22)} />}
          description={<Trans>Flip the user interface right to left</Trans>}
          action={<Checkbox />}
          onClick={() => void 0}
        >
          <Trans>Enable RTL layout</Trans>
        </CategoryButton>
      }
    >
      <Match when={currentLanguage().rtl}>
        <CategoryButton
          icon={<MdKeyboardTab {...iconSize(22)} />}
          description={<Trans>Keep the user interface left to right</Trans>}
          action={<Checkbox />}
          onClick={() => void 0}
        >
          <Trans>Force LTR layout</Trans>
        </CategoryButton>
      </Match>
    </Switch>
  );
}

/**
 * Language contribution link
 */
function ContributeLanguageLink() {
  return (
    <a href="https://weblate.insrt.uk/engage/revolt/" target="_blank">
      <CategoryButton
        action="external"
        icon={<MdTranslate {...iconSize(22)} />}
        onClick={() => void 0}
        description={
          <Trans>Help contribute to an existing or new language</Trans>
        }
      >
        <Trans>Contribute a language</Trans>
      </CategoryButton>
    </a>
  );
}
