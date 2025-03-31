import { Trans } from "@lingui-solid/solid/macro";

import { clientController } from "@revolt/client";
import { CONFIGURATION } from "@revolt/common";
import { useNavigate } from "@revolt/routing";
import { Button } from "@revolt/ui";

import { FlowTitle } from "./Flow";
import { setFlowCheckEmail } from "./FlowCheck";
import { Fields, Form } from "./Form";

/**
 * Flow for resending email verification
 */
export default function FlowResend() {
  const navigate = useNavigate();

  /**
   * Resend email verification
   * @param data Form Data
   */
  async function resend(data: FormData) {
    const email = data.get("email") as string;
    const captcha = data.get("captcha") as string;

    await clientController.api.post("/auth/account/reverify", {
      email,
      captcha,
    });

    setFlowCheckEmail(email);
    navigate("/login/check", { replace: true });
  }

  return (
    <>
      <FlowTitle>
        <Trans>Resend verification</Trans>
      </FlowTitle>
      <Form onSubmit={resend} captcha={CONFIGURATION.HCAPTCHA_SITEKEY}>
        <Fields fields={["email"]} />
        <Button type="submit">
          <Trans>Resend</Trans>
        </Button>
      </Form>
      <a href="/login/auth">
        <Trans>Go back to login</Trans>
      </a>
    </>
  );
}
