import styled from 'styled-components';
import { useQuery } from 'react-query';
import { getCurrentUser } from '../../shared/database';
import UserIntroPage from './UserIntroPage';
import { getPosts, deletePost } from '../../shared/database';
import { useState } from 'react';

export default function Profile() {
  const { isLoading: PostsIsLoading, data: postsData, refetch: refetchPosts } = useQuery('posts', getPosts); //모든 게시글
  const { isLoading: UserIsLoading, data: userData } = useQuery('users', getCurrentUser); //현재 로그인한 사람의 정보
  const [deletedPostId, setDeletedPostId] = useState(null);

  if (PostsIsLoading || UserIsLoading) {
    return <h1>데이터 로드중...</h1>;
  }

  const myPosts = postsData.filter((post) => post.userId === userData.userId);

  const handleDeletePost = async (postId) => {
    const confirmDelete = window.confirm('게시물을 삭제하시겠습니까?');
    if (confirmDelete) {
      try {
        await deletePost(postId);
        setDeletedPostId(postId);
        await refetchPosts();
      } catch (error) {
        console.error('게시물 삭제 중 오류 발생:', error);
      }
    }
  };

  return (
    <Container>
      <ProfileWrapper>
        <UserIntroPage />
        <UserInputList>
          <ListTitle>내가 작성한 가배도</ListTitle>
          {myPosts ? (
            myPosts.map((post) => (
              <PostList key={post.id}>
                <div>{post.title || '제목 없음'}</div>
                <Button onClick={() => handleDeletePost(post.id)}>삭제</Button>
              </PostList>
            ))
          ) : (
            <p>작성한 게시물이 없습니다.</p>
          )}
        </UserInputList>
        <UserInputList>
          <ListTitle>북마크한 가배도</ListTitle>
        </UserInputList>
      </ProfileWrapper>
    </Container>
  );
}

const Container = styled.div`
  background-color: #fff9f3;
  border: 2px solid #e0c3ae;
  border-radius: 50px;
  box-shadow: 5px 5px 20px 3px #e0c3ae;
  width: 800px;
  padding: 7rem;
  margin: 100px auto;
  align-items: center;

  & h1 {
    height: 50px;
    line-height: 5px;
    font-size: 1.6rem;
    font-family: 'SunBatang-Medium';
    color: #784b31;
  }
`;

const ProfileWrapper = styled.section`
  display: block;
  gap: 10px;
  flex-wrap: nowrap;

  & p {
    padding: 10px 20px;
    font-size: 13px;
    color: #784b31;
    background-color: #fff;
    border-radius: 30px;
  }
`;

const UserInputList = styled.ul`
  display: flex;
  flex-direction: column;
  place-content: center;
  gap: 20px;
  margin: 20px;
`;

const ListTitle = styled.h2`
  margin: 20px auto;
  font-size: 20px;
  font-weight: bold;
  color: #c70000;
  display: flex;
  align-items: center;
`;

const Button = styled.button`
  background-color: #784b31;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    transition: 0.5s;
    background-color: #c70000;
  }
`;

const PostList = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-radius: 15px;
  padding: 4px;
  padding-left: 15px;
  padding-right: 15px;
`;