import { Show } from "solid-js";

import { useLingui } from "@lingui-solid/solid/macro";
import { styled } from "styled-system/jsx";

import { useVoice } from "@revolt/rtc";
import { Button, IconButton } from "@revolt/ui/components/design";
import { Symbol } from "@revolt/ui/components/utils/Symbol";

export function VoiceCallCardActions() {
  const voice = useVoice();
  const { t } = useLingui();

  return (
    <Actions>
      <IconButton
        variant={voice.microphone() ? "filled" : "tonal"}
        onPress={() => voice.toggleMute()}
        use:floating={{
          tooltip: voice.speakingPermission
            ? undefined
            : {
                placement: "top",
                content: t`Missing permission`,
              },
        }}
        isDisabled={!voice.speakingPermission}
      >
        <Show when={voice.microphone()} fallback={<Symbol>mic_off</Symbol>}>
          <Symbol>mic</Symbol>
        </Show>
      </IconButton>
      <IconButton
        variant={voice.deafen() || !voice.listenPermission ? "tonal" : "filled"}
        onPress={() => voice.toggleDeafen()}
        use:floating={{
          tooltip: voice.listenPermission
            ? undefined
            : {
                placement: "top",
                content: t`Missing permission`,
              },
        }}
        isDisabled={!voice.listenPermission}
      >
        <Show
          when={voice.deafen() || !voice.listenPermission}
          fallback={<Symbol>headset</Symbol>}
        >
          <Symbol>headset_off</Symbol>
        </Show>
      </IconButton>
      <IconButton
        variant={"tonal"}
        use:floating={{
          tooltip: {
            placement: "top",
            content: "Coming soon! 👀",
          },
        }}
        isDisabled
      >
        <Symbol>camera_video</Symbol>
      </IconButton>
      <IconButton
        variant={"tonal"}
        use:floating={{
          tooltip: {
            placement: "top",
            content: "Coming soon! 👀",
          },
        }}
        isDisabled
      >
        <Symbol>screen_share</Symbol>
      </IconButton>
      <Button variant="_error" onPress={() => voice.disconnect()}>
        <Symbol>call_end</Symbol>
      </Button>
    </Actions>
  );
}

const Actions = styled("div", {
  base: {
    flexShrink: 0,
    gap: "var(--gap-md)",
    margin: "var(--gap-md)",
    padding: "var(--gap-md)",

    display: "flex",
    width: "fit-content",
    justifyContent: "center",
    alignSelf: "center",

    borderRadius: "var(--borderRadius-full)",
    background: "var(--md-sys-color-surface-container)",
  },
});
