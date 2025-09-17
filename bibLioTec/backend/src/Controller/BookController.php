<?php

namespace App\Controller;

use App\Entity\Book;
use App\Repository\BookRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

#[Route('/api/books')]
class BookController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function index(BookRepository $bookRepository): JsonResponse
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');
        $books = $bookRepository->findAll();
        return $this->json($books);
    }

    #[Route('', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');
        $data = json_decode($request->getContent(), true);
        $book = new Book();
        $book->setTitle($data['title'] ?? '')
            ->setAuthor($data['author'] ?? '')
            ->setPublishedYear($data['publishedYear'] ?? 0)
            ->setCategory($data['category'] ?? '')
            ->setAvailable($data['available'] ?? true);
        $em->persist($book);
        $em->flush();
        return $this->json($book, Response::HTTP_CREATED);
    }

    #[Route('/{id}', methods: ['GET'])]
    public function show(Book $book): JsonResponse
    {
        return $this->json($book);
    }

    #[Route('/{id}', methods: ['PUT', 'PATCH'])]
    public function update(Request $request, Book $book, EntityManagerInterface $em): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');
        $data = json_decode($request->getContent(), true);
        $book->setTitle($data['title'] ?? $book->getTitle())
            ->setAuthor($data['author'] ?? $book->getAuthor())
            ->setPublishedYear($data['publishedYear'] ?? $book->getPublishedYear())
            ->setCategory($data['category'] ?? $book->getCategory())
            ->setAvailable($data['available'] ?? $book->isAvailable());
        $em->flush();
        return $this->json($book);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(Book $book, EntityManagerInterface $em): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');
        $em->remove($book);
        $em->flush();
        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
