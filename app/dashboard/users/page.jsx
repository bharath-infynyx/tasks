//import { deleteUser } from "@/app/lib/actions";
import { fetchUser } from "../../lib/actions";
import Pagination from "../../ui/dashboard/pagination/pagination";
import Search from "../../ui/dashboard/search/search";
import styles from "../../ui/dashboard/users/users.module.css";
import Image from "next/image";
import Link from "next/link";

const Users = async ({ searchParams }) => {
  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;
  const { count, users } = await fetchUser(searchParams);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="Search for a user..." />
        <Link href="/dashboard/users/add">
          <button className={styles.addButton}>Add New</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>UserName</td>
            <td>Email</td>
            <td>Created At</td>
            <td>Role</td>
            <td>Status</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <div className={styles.user}>
                  {user.displayName}
                </div>
              </td>
              <td>{user.userPrincipalName}</td>
              <td>{user.createdAt?.toString().slice(4, 16)}</td>
              <td>
                <div className={styles.buttons}>
                  <Link href={`/dashboard/users/${user.userPrincipalName}`}>
                    <button className={`${styles.button} ${styles.view}`}>
                      View
                    </button>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination count={count} />
    </div>
  );
};

export default Users;
