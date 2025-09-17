<?php

namespace App\Controller;

use App\Entity\Loan;
use App\Repository\LoanRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/loans')]
class LoanController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function index(LoanRepository $loanRepository): JsonResponse
    {
        $loans = $loanRepository->findAll();
        return $this->json($loans);
    }

    #[Route('/{id}', methods: ['GET'])]
    public function show(Loan $loan): JsonResponse
    {
        return $this->json($loan);
    }

    #[Route('', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $loan = new Loan();
        // Aqui você pode adicionar lógica para setar userRef, book, datas, etc.
        $em->persist($loan);
        $em->flush();
        return $this->json($loan, Response::HTTP_CREATED);
    }

    #[Route('/{id}', methods: ['PUT', 'PATCH'])]
    public function update(Request $request, Loan $loan, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        // Atualize os campos conforme necessário
        $em->flush();
        return $this->json($loan);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(Loan $loan, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($loan);
        $em->flush();
        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
} 