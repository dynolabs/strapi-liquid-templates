import { Button, Modal, Field } from '@strapi/design-system';
import { getMessage } from '../utils/getMessage';
import styled from 'styled-components';
import { DeviceFrameset, DeviceEmulator } from 'react-device-frameset';
import 'react-device-frameset/styles/marvel-devices.min.css';
import 'react-device-frameset/styles/device-emulator.min.css';
import React from 'react';
import { Tabs } from '@strapi/design-system';
import { IconButton } from '@strapi/design-system';
import { Flex } from '@strapi/design-system';

const ModalContent = styled(Modal.Content)`
  max-width: inherit;
  max-height: inherit;
  width: 100%;
  height: 100%;
`;

const ModalBody = styled(Modal.Body)`
  & > div {
    padding: 0;
  }

  & > div > div {
    height: 100%;
  }
`;

type TProps = {
  isOpen: boolean;
  content: string;
  onToggle: (status: boolean) => void;
};

const TemplatePreviewModal = ({ isOpen, content, onToggle }: Readonly<TProps>) => {
  return (
    <Modal.Root open={isOpen} onOpenChange={onToggle}>
      <ModalContent>
        <Modal.Header>
          <Modal.Title>{getMessage('label.templatePreview')}</Modal.Title>
        </Modal.Header>
        <ModalBody id="modal-body">
          <Tabs.Root defaultValue="desktop" variant="simple">
            <Tabs.List aria-label="Device Preview">
              <Tabs.Trigger value="desktop">Desktop</Tabs.Trigger>
              <Tabs.Trigger value="mobile">Mobile</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="desktop">
              <Flex justifyContent="center" alignItems="center">
                <DeviceFrameset device="MacBook Pro">
                  <iframe
                    srcDoc={content}
                    height="100%"
                    width="100%"
                    style={{
                      border: 'none',
                    }}
                  />
                </DeviceFrameset>
              </Flex>
            </Tabs.Content>

            <Tabs.Content value="mobile">
              <Flex justifyContent="center" alignItems="center">
                <DeviceFrameset device="iPhone 4s" color="silver">
                  <iframe
                    srcDoc={content}
                    height="100%"
                    width="100%"
                    style={{
                      border: 'none',
                    }}
                  />
                </DeviceFrameset>
              </Flex>
            </Tabs.Content>
          </Tabs.Root>
        </ModalBody>
        <Modal.Footer>
          <Modal.Close>
            <Button variant="tertiary">Cancel</Button>
          </Modal.Close>
        </Modal.Footer>
      </ModalContent>
    </Modal.Root>
  );
};

export { TemplatePreviewModal };
