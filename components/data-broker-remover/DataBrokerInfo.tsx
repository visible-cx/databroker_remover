'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { BROKER_NAMES } from '@/lib/data-broker-remover/broker-list';
import Link from 'next/link';

const FAQ_ITEMS = [
  {
    title: 'HOW DOES IT WORK?',
    content: (
      <div className="space-y-3">
        <ol className="ml-5 list-decimal space-y-2 text-warmgray/80">
          <li>Enter your email address</li>
          <li>We&apos;ll send you a verification code</li>
          <li>
            Once you confirm the code, you can input your name & address to
            generate the email to send to the broker. We do not store your name
            or address, it is only used to generate the email.
          </li>
          <li>
            We send the emails out. You will be CC&apos;d on them so you can see
            them, you don&apos;t need to take any action.
          </li>
          <li>
            Only your email address is stored once it has been hashed (SHA256),
            and is deleted after 45 days. This is to ensure you don&apos;t send out
            multiple emails within a short period of time. You&apos;re free to repeat
            the process after 45 days.
          </li>
        </ol>
        <p className="text-warmgray/80 text-sm mt-4">
          See the source code{' '}
          <a
            href="https://github.com/visible-cx/visible"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline hover:text-warmgray"
          >
            here
          </a>
          . The privacy policy for this tool can be found in our main{' '}
          <Link href="/privacy" className="font-bold underline hover:text-warmgray">
            privacy policy
          </Link>
          .
        </p>
      </div>
    ),
  },
  {
    title: 'WHO ARE THE DATA BROKERS?',
    content: (
      <div className="space-y-3">
        <p className="text-warmgray/80">
          This is the current list of data brokers that will be contacted:
        </p>
        <ul className="ml-5 grid grid-cols-2 gap-2 text-warmgray/80 text-sm">
          {BROKER_NAMES.map((broker) => (
            <li key={broker} className="list-disc">
              {broker}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    title: 'WHO BUILT THIS?',
    content: (
      <div className="space-y-3 text-warmgray/80">
        <p>This tool was built by the team at Visible.</p>
        <p>
          If you&apos;d like to see more of what we do, please consider joining the
          community{' '}
          <a
            href="https://www.visible.cx/join"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline hover:text-warmgray"
          >
            here
          </a>
          .
        </p>
      </div>
    ),
  },
];

export function DataBrokerInfo() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      {FAQ_ITEMS.map((item, index) => {
        const isOpen = openItems.has(index);
        return (
          <Collapsible.Root
            key={index}
            open={isOpen}
            onOpenChange={() => toggleItem(index)}
            className="border border-plum-600 rounded-lg overflow-hidden"
          >
            <Collapsible.Trigger className="w-full flex items-center justify-between p-4 bg-plum-800 hover:bg-plum-700 transition-colors">
              <span className="font-semibold text-warmgray text-left">
                {item.title}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-warmgray transition-transform duration-200 ${
                  isOpen ? 'transform rotate-180' : ''
                }`}
              />
            </Collapsible.Trigger>
            <Collapsible.Content className="bg-plum-900 p-4 border-t border-plum-600">
              {item.content}
            </Collapsible.Content>
          </Collapsible.Root>
        );
      })}
    </div>
  );
}
