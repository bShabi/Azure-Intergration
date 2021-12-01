import Link from 'next/link';
import { parseCookies, setCookie } from 'nookies';

export default function Me({ cookies }) {
  console.log('cookies', cookies);
  return (
    <div>
      My profile. Cookies:
      <ul>
        {cookies &&
          Object.entries(cookies).map(([name, value]) => (
            <li>
              {name}: {value}
            </li>
          ))}
      </ul>
      <Link href='/about'>
        <a>About page</a>
      </Link>
    </div>
  );
}

Me.getInitialProps = async function (ctx) {
  // Parse
  const cookies = parseCookies(ctx);

  // Set
  setCookie(ctx, 'fromGetInitialProps', 'value', {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  });
  console.log('cookies', cookies['token']);
  // ctx.entries(cookies).map(([name, value]) => console.log(name, ':', value));
  // Destroy
  // destroyCookie(ctx, "token");

  return { cookies };
};
