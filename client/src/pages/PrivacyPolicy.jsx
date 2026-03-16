import React from 'react';
import styled from 'styled-components';
import Container from '../components/common/Container';
import Card from '../components/common/Card';

const PrivacyContainer = styled.div`
  padding: var(--spacing-lg) 0;
`;

const PageTitle = styled.h1`
  margin-bottom: var(--spacing-lg);
`;

const Section = styled.div`
  margin-bottom: var(--spacing-xl);
`;

const SectionTitle = styled.h2`
  margin-bottom: var(--spacing-md);
  color: var(--primary-color);
`;

const SectionContent = styled.div`
  line-height: 1.6;
  
  p {
    margin-bottom: var(--spacing-md);
  }
  
  ul, ol {
    margin-bottom: var(--spacing-md);
    padding-left: var(--spacing-lg);
  }
  
  li {
    margin-bottom: var(--spacing-sm);
  }
  
  strong {
    font-weight: 600;
  }
`;

const LastUpdated = styled.div`
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: var(--font-size-small);
`;

const PrivacyPolicy = () => {
  return (
    <PrivacyContainer>
      <Container>
        <PageTitle>Privacy Policy</PageTitle>
        
        <Card>
          <Section>
            <SectionTitle>Introduction</SectionTitle>
            <SectionContent>
              <p>
                Welcome to our Mental Health Tracking Application. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
              </p>
              <p>
                Please read this Privacy Policy carefully. By accessing or using our application, you acknowledge that you have read, understood, and agree to be bound by all the terms outlined in this Privacy Policy.
              </p>
            </SectionContent>
          </Section>
          
          <Section>
            <SectionTitle>Information We Collect</SectionTitle>
            <SectionContent>
              <p>We collect several types of information for various purposes to provide and improve our service to you:</p>
              <ul>
                <li>
                  <strong>Personal Information:</strong> When you register for an account, we collect your name, email address, and password.
                </li>
                <li>
                  <strong>Health Information:</strong> We collect information you voluntarily provide about your mental health, including mood tracking data, journal entries, goals, and other self-reported mental health information.
                </li>
                <li>
                  <strong>Usage Data:</strong> We collect information on how you interact with our application, including pages visited, features used, and time spent on the application.
                </li>
                <li>
                  <strong>Device Information:</strong> We collect information about the device you use to access our application, including device type, operating system, and browser type.
                </li>
              </ul>
            </SectionContent>
          </Section>
          
          <Section>
            <SectionTitle>How We Use Your Information</SectionTitle>
            <SectionContent>
              <p>We use the information we collect for various purposes, including:</p>
              <ul>
                <li>To provide and maintain our service</li>
                <li>To personalize your experience with our application</li>
                <li>To analyze usage patterns and improve our application</li>
                <li>To communicate with you about updates, changes, or new features</li>
                <li>To provide personalized insights and recommendations based on your data</li>
                <li>To ensure the security and integrity of our application</li>
              </ul>
            </SectionContent>
          </Section>
          
          <Section>
            <SectionTitle>Data Security</SectionTitle>
            <SectionContent>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. These measures include:
              </p>
              <ul>
                <li>Encryption of sensitive data both in transit and at rest</li>
                <li>Regular security assessments and vulnerability testing</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Regular backups to prevent data loss</li>
                <li>Employee training on data protection and privacy</li>
              </ul>
              <p>
                While we strive to use commercially acceptable means to protect your personal information, no method of transmission over the Internet or method of electronic storage is 100% secure. We cannot guarantee absolute security.
              </p>
            </SectionContent>
          </Section>
          
          <Section>
            <SectionTitle>Sharing Your Information</SectionTitle>
            <SectionContent>
              <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
              <ul>
                <li>
                  <strong>With Service Providers:</strong> We may share your information with third-party service providers who perform services on our behalf, such as hosting, data analysis, and customer service.
                </li>
                <li>
                  <strong>For Legal Reasons:</strong> We may disclose your information if required by law or in response to valid requests by public authorities.
                </li>
                <li>
                  <strong>With Your Consent:</strong> We may share your information with third parties when we have your consent to do so.
                </li>
              </ul>
            </SectionContent>
          </Section>
          
          <Section>
            <SectionTitle>Your Data Rights</SectionTitle>
            <SectionContent>
              <p>You have certain rights regarding your personal information, including:</p>
              <ul>
                <li>The right to access the personal information we hold about you</li>
                <li>The right to request correction of inaccurate information</li>
                <li>The right to request deletion of your information</li>
                <li>The right to restrict or object to processing of your information</li>
                <li>The right to data portability</li>
                <li>The right to withdraw consent at any time</li>
              </ul>
              <p>
                To exercise any of these rights, please contact us using the information provided in the "Contact Us" section.
              </p>
            </SectionContent>
          </Section>
          
          <Section>
            <SectionTitle>Data Retention</SectionTitle>
            <SectionContent>
              <p>
                We will retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>
              <p>
                When we no longer need to process your information for the purposes described in this Privacy Policy, we will delete your information from our systems or anonymize it so that it can no longer be associated with you.
              </p>
            </SectionContent>
          </Section>
          
          <Section>
            <SectionTitle>Children's Privacy</SectionTitle>
            <SectionContent>
              <p>
                Our application is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13 without verification of parental consent, we will take steps to remove that information from our servers.
              </p>
            </SectionContent>
          </Section>
          
          <Section>
            <SectionTitle>Changes to This Privacy Policy</SectionTitle>
            <SectionContent>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
              <p>
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
              </p>
            </SectionContent>
          </Section>
          
          <Section>
            <SectionTitle>Contact Us</SectionTitle>
            <SectionContent>
              <p>
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <p>
                Email: privacy@mentalhealthapp.com<br />
                Address: 123 Mental Health Street, Wellness City, WC 12345
              </p>
            </SectionContent>
          </Section>
          
          <LastUpdated>
            Last Updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </LastUpdated>
        </Card>
      </Container>
    </PrivacyContainer>
  );
};

export default PrivacyPolicy;
