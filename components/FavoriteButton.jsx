'use client';
import { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import bookmarkProperty from '@/app/actions/bookmarkProperty';
import checkBookmarkStatus from '@/app/actions/checkBookmarkStatus';
import { toast } from 'react-toastify';

const FavoriteButton = ({ property }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    checkBookmarkStatus(property._id).then((res) => {
      if (res.error) toast.error(res.error);
      if (res.isBookmarked) setIsFavorited(res.isBookmarked);
      setLoading(false);
    });
  }, [property._id, userId]);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      toast.error('You need to sign in to favorite a property');
      return;
    }

    bookmarkProperty(property._id).then((res) => {
      if (res.error) return toast.error(res.error);
      setIsFavorited(res.isBookmarked);
      toast.success(res.message);
    });
  };

  if (loading) {
    return (
      <button className='absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center'>
        <FaRegHeart className='text-gray-400 text-lg animate-pulse' />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className='absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-all duration-200 hover:scale-110 active:scale-95'
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorited ? (
        <FaHeart className='text-red-500 text-lg' />
      ) : (
        <FaRegHeart className='text-gray-700 text-lg' />
      )}
    </button>
  );
};

export default FavoriteButton;