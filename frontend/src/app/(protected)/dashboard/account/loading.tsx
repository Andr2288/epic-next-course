import { Skeleton } from "@/components/ui/skeleton";

const styles = {
  container: "grid grid-cols-1 gap-4 p-4 lg:grid-cols-5",
  profileForm: "space-y-4 lg:col-span-3",
  profileImage: "space-y-4 lg:col-span-2",
  skeleton: "animate-pulse",
  title: "h-8 w-1/3",
  input: "h-10 w-full",
  textarea: "h-24 w-full",
  button: "h-10 w-24",
  imageContainer: "h-48 w-full rounded-lg",
};

export default function AccountLoading() {
  return (
    <div className={styles.container}>
      <div className={styles.profileForm}>
        <Skeleton className={`${styles.skeleton} ${styles.title}`} />
        <Skeleton className={`${styles.skeleton} ${styles.input}`} />
        <Skeleton className={`${styles.skeleton} ${styles.input}`} />
        <Skeleton className={`${styles.skeleton} ${styles.input}`} />
        <Skeleton className={`${styles.skeleton} ${styles.input}`} />
        <Skeleton className={`${styles.skeleton} ${styles.textarea}`} />
        <Skeleton className={`${styles.skeleton} ${styles.button}`} />
      </div>
      <div className={styles.profileImage}>
        <Skeleton className={`${styles.skeleton} ${styles.title}`} />
        <Skeleton className={`${styles.skeleton} ${styles.imageContainer}`} />
        <Skeleton className={`${styles.skeleton} ${styles.button}`} />
      </div>
    </div>
  );
}
