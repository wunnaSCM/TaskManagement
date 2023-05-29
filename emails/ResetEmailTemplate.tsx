import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface ResetPasswordEmailProps {
  userName: string;
  resetPasswordLink: string;
}

export const ResetPasswordEmail = ({
  userName,
  resetPasswordLink,
}: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset Your Password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Text style={h1Text}>SCM Task Management</Text>
            <Text style={text}>Hi,{userName}</Text>
            <Text style={text}>
              Someone recently requested a password change for your Task
              Mangement account.
            </Text>
            <Text style={text}>
              If this was you, you can set a new password by clicking the link
              below:
            </Text>
            <Link style={button} href={resetPasswordLink}>
              Reset password
            </Link>
            <Text style={text}>
              If you don&apos;t want to change your password or didn&apos;t
              request this, just ignore and delete this message.
            </Text>
            <Text style={text}>
              To keep your account secure, please don&apos;t forward this email
              to anyone.
            </Text>
            <br />
            <Text style={text}>- SCM Task Management</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ResetPasswordEmail;

const main = {
  backgroundColor: '#f6f9fc',
  padding: '10px 0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  padding: '45px',
};

const h1Text = {
  fontSize: '20px',
  fontFamily:
    '\'Open Sans\', \'HelveticaNeue-Light\', \'Helvetica Neue Light\', \'Helvetica Neue\', Helvetica, Arial, \'Lucida Grande\', sans-serif',
  fontWeight: '500',
  color: '#f52f7b',
  lineHeight: '30px',
};

const text = {
  fontSize: '16px',
  fontFamily:
    '\'Open Sans\', \'HelveticaNeue-Light\', \'Helvetica Neue Light\', \'Helvetica Neue\', Helvetica, Arial, \'Lucida Grande\', sans-serif',
  fontWeight: '300',
  color: '#404040',
  lineHeight: '26px',
};

const button = {
  backgroundColor: '#f52f7b',
  borderRadius: '8px',
  color: '#fff',
  fontFamily: '\'Open Sans\', \'Helvetica Neue\', Arial',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '210px',
  padding: '16px 4px',
};
