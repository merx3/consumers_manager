<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Consumer;
use Illuminate\Validation\Rule;
use JsValidator;


class ConsumersManager extends Controller
{
    protected $validationRules;

    public function __construct()
    {
        $this->validationRules = [
            'name' => 'required|min:4|max:40',
            'age' => 'required|integer|min:14|max:99',
            'city' => [
                'required',
                Rule::in(explode(',', env('CONSUMER_CITIES')))
            ]
        ];
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('consumers.manager');
    }


    public function getAll()
    {
        $consumers = Consumer::all();
        $validator = JsValidator::make($this->validationRules);
        return response()->json([
            'validator' => $validator->toArray(),
            'consumers' => $consumers
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request->validate($this->validationRules);
        $consumer = Consumer::create($data);
        return response()->json($consumer);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $consumer = Consumer::find($id);
        $data = $request->validate($this->validationRules);
        $consumer->fill($data);
        $consumer->save();
        return response()->json($consumer);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if (Consumer::destroy($id)) {
            return response()->json([
                'code' => 200,
                'message' => 'User with id ' . $id . ' was deleted successfully.'
            ]);
        } else {
            return response()->json([
                'code' => 404,
                'message' => 'User with id ' . $id . ' was not found.'
            ], 404);
        }
    }
}
