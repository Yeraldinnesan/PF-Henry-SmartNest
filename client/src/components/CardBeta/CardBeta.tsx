import React, { useEffect, useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { Rating } from '@mui/material';
import { toast, Zoom } from 'react-toastify';
import onLike from '../../assets/foro/DarkMode/onLike.svg';
import outLike from '../../assets/foro/DarkMode/outLike.svg';
import outLikeBlue from '../../assets/foro/DarkMode/outHeartblue.svg';
import onLikeBlue from '../../assets/foro/DarkMode/onHeartblue.svg';
import { useAppDispatch, useAppSelector } from '../../Redux/hook';
import { addFavoriteFetch } from '../../Redux/slice/user/userController';
import { addFavorite } from '../../Redux/slice/user/user.slice';
import { userInterface, getUserLogin } from '../../Redux/slice/user/user.slice';

import { FilterState, ProductState } from '../../Redux/slice/product/product.slice';
import { getProduct } from '../../Redux/slice/product/product.slice';
import { productFetch } from '../../Redux/slice/product/ProductController';
import PaginationComp from '../Pagination';
import QuickLookModal from './QuickLookModal';
import { useAuth0 } from '@auth0/auth0-react';

import { addProduct, deleteProduct } from '../../Redux/slice/shoppingCart/shoppingCart.slice';
import { ProductCart } from '../../Redux/slice/shoppingCart/shoppingCart.slice';

import favoriteUnset_w from '../../assets/images/icons/favorite/favorite_w.png';
import favoriteSet_w from '../../assets/images/icons/favorite/favorite_b.png';
import AddFavoritesModal from './AddFavoritesModal';

const CardBeta: React.FC<{}> = () => {
  const Allproduct: ProductState[] = useAppSelector((state) => state.productReducer.Products);
  const productsInCart = useAppSelector((state) => state.cartReducer.Products);
  const userByBd: userInterface = useAppSelector((state) => state.userReducer.userState);
  const [getFavorites, setGetFavorites] = useState<ProductState[]>([]);

  const AllproductLength = Allproduct.reduce((acc, product) => {
    if (product.isActive) return acc + 1;

    return acc;
  }, 0);

  const filters: FilterState = useAppSelector((state) => state.productReducer.Filters);

  const dispatch = useAppDispatch();

  useEffect(() => {
    productFetch().then((res) => {
      dispatch(getProduct(res));
    });
  }, []);

  useEffect(() => {
    if (!Allproduct.length) {
      productFetch().then((res) => {
        dispatch(getProduct(res));
      });
    }
  }, [Allproduct]);

  //--------------------------->  CART CARD FEATURES

  const handleAddCart = (product: ProductState) => {
    const productCart: ProductCart = {
      _id: product._id,
      name: product.name,
      price: product.price,
      brand: product.brand,
      images: product.images,
      categories: product.categories,
      stock: product.stock,
      quantity: 1,
      inCart: true,
    };

    dispatch(addProduct(productCart));

    toast.success('Product added to Cart', {
      position: 'top-center',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
      transition: Zoom,
    });
  };

  const handleRemoveCart = (product: ProductState) => {
    dispatch(deleteProduct(product._id));

    toast.error('Product removed from Cart', {
      position: 'top-center',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
      transition: Zoom,
    });
  };

  // const product = state.Products.find

  //----------------------> FAVORITES CARD FEATURES
  const [modalOpen, setModalOpen] = useState(false);
  const dark: boolean = useAppSelector((state) => state.themeReducer.dark);
  const { user, isAuthenticated } = useAuth0();

  //!--------------------------------------------------------------------------------------
  const handleToggleFavorite = async (product: ProductState) => {
    if (isAuthenticated && user?.email_verified) {
      const newFavorite: ProductState = {
        _id: product._id,
        name: product.name,
        price: product.price,
        description: product.description,
        brand: product.brand,
        images: product.images,
        rating: product.rating,
        categories: product.categories,
        stock: product.stock,
        isActive: product.isActive,
      };

      let actualFavorites: ProductState[] = userByBd.favorites;

      if (!actualFavorites.length) {
        actualFavorites = [newFavorite];
      } else {
        const findFavo = actualFavorites.find((favorite) => favorite._id === newFavorite._id);

        if (findFavo?._id) {
          actualFavorites = actualFavorites.filter((favorite) => favorite._id !== newFavorite._id);

          toast.error('Product removed from favorites', {
            position: 'top-center',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
            transition: Zoom,
          });
        } else {
          actualFavorites = [...actualFavorites, newFavorite];

          toast.success('Product added to favorites', {
            position: 'top-center',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
            transition: Zoom,
          });
        }
      }

      const userUpdate = await addFavoriteFetch(userByBd._id, newFavorite, actualFavorites);
      dispatch(addFavorite(userUpdate.favorites));
      setGetFavorites(userUpdate.favorites);
    } else {
      setModalOpen(true);
    }
  };

  //!--------------------------------------------------------------------------------------
  //!--------------------------------------------------------------------------------------
  //handleToggleFavorite({});
  //-----------------------> Helper Functions <----------------------

  const priceFormat = (productPrice: number) => {
    const formattedNumber = productPrice.toFixed(2);
    return formattedNumber;
  };

  //-----------------> PAGINATION <----------------------------------

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // useEffect(() => {
  //   handlePageChange(1);
  // }, [filters]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Allproduct.slice(indexOfFirstItem, indexOfLastItem);

  //-----------------------> QUICKLOOK MODAL  <-------------------------------

  useEffect(() => {
    if (isAuthenticated) {
      setGetFavorites(userByBd.favorites);
    } else {
      setGetFavorites([]);
    }
  }, [isAuthenticated]);

  return (
    <div className='container-render-card-v-beta'>
      <div className='container-card-beta'>
        {currentItems?.map((product) => {
          if (product.isActive) {
            let iconFavorite = dark ? outLike : outLikeBlue;

            getFavorites.map((favorite) => {
              if (favorite._id === product._id) {
                iconFavorite = dark ? onLike : onLikeBlue;
              }
            });

            return (
              <div key={product._id} className='product-card-beta'>
                <div className='header-card-beta'>
                  <div className='container-favorite' onClick={() => handleToggleFavorite(product)}>
                    <img src={iconFavorite} alt={iconFavorite} />
                  </div>

                  <QuickLookModal
                    product={product}
                    handleAddCart={handleAddCart}
                    // handleRemoveCart={handleRemoveCart}
                    priceFormat={priceFormat}

                    // handleCloseModal={handleCloseModal}
                    // showModal={showModal}
                  />
                </div>

                <div className='content-image-card-beta'>
                  <Link className='link-image-card' to={`/product/${product._id}`}>
                    <img className='image-card' src={product.images[0]} alt='image' />
                  </Link>
                </div>

                <div className='content-title-description-card-beta'>
                  <h3 className='product-name-card-beta'>{product.name.substring(0, 25)}...</h3>

                  <p className='product-description-card-beta'>
                    {product.description.substring(0, 57)}...
                  </p>
                </div>

                <div className='content-value-rating-card-beta'>
                  <div className='content-rating-card-beta'>
                    <Rating size='small' value={product.rating} precision={0.5} readOnly />
                  </div>

                  <div className='content-value-card-beta'>
                    <h4 className='price2'>$ {priceFormat(product.price)}</h4>
                  </div>
                </div>

                <div className='content-add-car-card-beta'>
                  {product.stock > 0 && !productsInCart.find((el) => el._id === product._id) ? (
                    <div className='add-car-card-beta' onClick={() => handleAddCart(product)}>
                      <p>Add to Cart</p>
                    </div>
                  ) : product.stock > 0 && productsInCart.find((el) => el._id === product._id) ? (
                    <div className='add-car-card-beta' onClick={() => handleRemoveCart(product)}>
                      <p>Remove</p>
                    </div>
                  ) : (
                    <div
                      className='add-car-card-beta'
                      style={{
                        color: 'rgba(20, 20, 20, 0.8)',
                        backgroundColor: 'rgba(229, 229, 229, 1)',
                        fontFamily: "'Urbanist', sans-serif",
                        fontWeight: '500',
                        cursor: 'no-drop',
                      }}
                    >
                      <p style={{ color: 'rgba(20, 20, 20, 0.8)' }}>out of Stock</p>
                    </div>
                  )}
                </div>
              </div>
            );
          }
        })}
      </div>
      {modalOpen && <AddFavoritesModal />}
      <div className='pagination2'>
        <PaginationComp
          itemsPerPage={itemsPerPage}
          totalItems={AllproductLength}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default CardBeta;
