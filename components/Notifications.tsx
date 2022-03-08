import cn from 'classnames';
import { createContext, useContext, useState } from 'react';
import { useTransition, animated } from 'react-spring';
import { v4 as uuid } from 'uuid';

export type NotificationType = 'info' | 'success' | 'error' | 'warning';

function Notification(props: {
  children: any;
  type: NotificationType;
  shown: boolean;
}) {
  return (
    <div
      className={cn({
        'transition-all my-4 flex-col mx-auto rounded-md border flex  shadow-2xl relative z-50 bg-white dark:bg-black  ':
          true,
        'border-green-500': props.type === 'success',
        'border-yellow-500': props.type === 'warning',
        'border-red-500': props.type === 'error',
        'opacity-100': props.shown,
        'opacity-0': !props.shown,
        '-top-10': !props.shown,
        'top-0': props.shown,
      })}
    >
      <div
        className={cn({
          ' w-full  rounded-tr-md rounded-tl-md border-top': true,
          hidden: props.type === 'info',
          'bg-green-500 h-1': props.type === 'success',
          'bg-yellow-500 h-1': props.type === 'warning',
          'bg-red-500 h-1': props.type === 'error',
        })}
      />
      <div className="px-4 py-2">{props.children}</div>
    </div>
  );
}

export type NotifyFunction = (type: NotificationType, msg: string) => any;

const notificationCtx = createContext<{
  notify: NotifyFunction;
}>({
  notify: (type: NotificationType, msg: string) => {},
});

export function useNotifications() {
  const ctx = useContext(notificationCtx);
  return ctx.notify;
}

export default function Notifications(props: any) {
  const [notifications, setNotification] = useState<
    Array<{
      type: NotificationType;
      msg: string;
      shown: boolean;
      id: string;
    }>
  >([]);

  const transitions = useTransition(
    notifications,
    (i: any) => {
      if (!i) return '';
      else return i.id;
    },
    {
      from: { transform: 'translate3d(0,-40px,0)' },
      enter: { transform: 'translate3d(0,0px,0)' },
      leave: { transform: 'translate3d(0,-40px,0)' },
      config: {
        duration: 80,
      },
    } as any
  );

  const els = transitions.map(({ item: n, props, key }: any) => (
    <animated.div key={key} style={props} className="flex m-auto">
      <Notification type={n.type} shown={n.shown} key={n.id}>
        {n.msg}
      </Notification>
    </animated.div>
  ));

  function notify(type: NotificationType, msg: string) {
    const id = uuid();
    setNotification((ns) => {
      return [
        ...ns,
        {
          type,
          msg,
          shown: true,
          id,
        },
      ];
    });

    // trigger animation
    setTimeout(() => {
      setNotification((ns) => {
        const i = ns.findIndex((n) => n.id === id);
        if (i == -1) return [...ns];
        ns[i].shown = false;
        return [...ns];
      });
    }, 3000);

    setTimeout(() => {
      setNotification((ns) => {
        return ns.slice(1);
      });
    }, 3200);
  }

  return (
    <notificationCtx.Provider
      value={{
        notify,
      }}
    >
      <div className="fixed w-full flex flex-col z-50">{els}</div>
      {props.children}
    </notificationCtx.Provider>
  );
}
