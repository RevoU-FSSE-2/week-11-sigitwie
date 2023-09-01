import PostDAO from '../dao/PostDao';
import { Post, PostAttributes } from '../models/PostModel';

jest.mock('../models/PostModel');

const mockCreate = jest.fn();
const mockGetById = jest.fn();
const mockGetByUserId = jest.fn();
const mockUpdateById = jest.fn();
const mockIsOwner = jest.fn();
const mockDeleteById = jest.fn();
const mockGetAllPosts = jest.fn();

(Post as any).create = mockCreate;
(Post as any).findByPk = mockGetById;
(Post as any).findAll = mockGetByUserId;
(Post as any).update = mockUpdateById;
(Post as any).destroy = mockDeleteById;


describe('Post Methods', () => {
    beforeEach(() => {
      // Clear all instances and calls to constructor and all methods:
      jest.clearAllMocks();
    });
 
    describe('create', () => {
    it('should create a post successfully', async () => {
      const mockPostData: PostAttributes = {
        content: 'Sample Content',
        userId: 1
      };
  
      const expectedResponse = {
        ...mockPostData,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };
  
      mockCreate.mockResolvedValue(expectedResponse);
  
      const postDAO = new PostDAO({} as any); // mengabaikan tipe sequelize untuk sederhana
      const response = await postDAO.create(mockPostData);
  
      expect(response).toEqual(expectedResponse);
    });

    describe('Get Post by ID', () => {
        it('should return post when it exists', async () => {
            const mockPostId = 1;
            const expectedPost: PostAttributes = {
                id: mockPostId,
                content: 'Sample Content for getById',
                userId: 1
            };

            mockGetById.mockResolvedValueOnce(expectedPost);

            const postDAO = new PostDAO({} as any);
            const response = await postDAO.getById(mockPostId);

            expect(response).toEqual(expectedPost);
        });

        it('should return null when post does not exist', async () => {
            const mockPostId = 2;

            mockGetById.mockResolvedValueOnce(null);

            const postDAO = new PostDAO({} as any);
            const response = await postDAO.getById(mockPostId);

            expect(response).toBeNull();
        });
    });
  
    describe('Get Posts by User ID', () => {
        it('should return posts for a given user ID', async () => {
            const mockUserId = 1;
            const expectedPosts: PostAttributes[] = [
                {
                    id: 1,
                    content: 'Sample Content for post 1',
                    userId: mockUserId
                },
                {
                    id: 2,
                    content: 'Sample Content for post 2',
                    userId: mockUserId
                }
            ];

            mockGetByUserId.mockResolvedValueOnce(expectedPosts);

            const postDAO = new PostDAO({} as any);
            const response = await postDAO.getByUserId(mockUserId);

            expect(response).toEqual(expectedPosts);
        });

        it('should return an empty array if user has no posts', async () => {
            const mockUserId = 2;

            mockGetByUserId.mockResolvedValueOnce([]);

            const postDAO = new PostDAO({} as any);
            const response = await postDAO.getByUserId(mockUserId);

            expect(response).toEqual([]);
        });
    });

    describe('Update Post by Post ID', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
    
        it('should update the post successfully', async () => {
            const mockPostId = 1;
            const mockPostUpdates = {
                content: 'Updated Content',
            };
        
            mockUpdateById.mockResolvedValueOnce([1]);
        
            const postDAO = new PostDAO({} as any);
            const updatedRows = await postDAO.updateById(mockPostId, mockPostUpdates);
        
            expect(updatedRows).toBe(1);
        });
    
        it('should return 0 if post is not found', async () => {
            const mockPostId = 99;
            const mockPostUpdates = {
                content: 'Updated Content',
            };
        
            // Mock the method to resolve with an array where the first value is 0
            mockUpdateById.mockResolvedValueOnce([0]);
        
            const postDAO = new PostDAO({} as any);
            const updatedRows = await postDAO.updateById(mockPostId, mockPostUpdates);
        
            expect(updatedRows).toBe(0);
        });
    
        it('should throw an error if there is a database issue', async () => {
            const mockPostId = 1;
            const mockPostUpdates = {
                content: 'Updated Content',
            };
    
            mockUpdateById.mockRejectedValueOnce(new Error('Database error'));
    
            const postDAO = new PostDAO({} as any);
    
            await expect(postDAO.updateById(mockPostId, mockPostUpdates)).rejects.toThrow('Database error');
        });
    
    });
    

  });
});