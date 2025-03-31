import { Trans } from "@lingui-solid/solid/macro";

import { useClient } from "@revolt/client";
import { Avatar, OverflowingText, Ripple, typography } from "@revolt/ui";

// import MdError from "@material-design-icons/svg/filled/error.svg?component-solid";
import { useSettingsNavigation } from "../Settings";
import {
  SidebarButton,
  SidebarButtonContent,
  SidebarButtonTitle,
} from "../_layout/SidebarButton";

/**
 * Account Card
 */
export function AccountCard() {
  const client = useClient();
  const { page, navigate } = useSettingsNavigation();

  return (
    <SidebarButton
      onClick={() => navigate("account")}
      aria-selected={page() === "account"}
    >
      <Ripple />
      <SidebarButtonTitle>
        <Avatar size={36} src={client().user!.animatedAvatarURL} />
        <SidebarButtonContent>
          <OverflowingText
            class={typography({ class: "label", size: "small" })}
          >
            {client().user!.displayName}
          </OverflowingText>
          <Trans>My Account</Trans>
        </SidebarButtonContent>
      </SidebarButtonTitle>
      {/*<SidebarButtonIcon>
        <MdError {...iconSize(20)} fill={theme!.colour("primary")} />
      </SidebarButtonIcon>*/}
    </SidebarButton>
  );
}
